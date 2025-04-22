using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Media;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.BackOffice.Security;

namespace Umbraco.Community.Umbraco.Crm.wwwroot.UmbracoCrm.NotificationHandlers;

[SuppressMessage("ReSharper", "ClassNeverInstantiated.Global")]
public class UserNotificationHandler :
    INotificationHandler<UserSavedNotification>,
    INotificationHandler<UserDeletingNotification>
{
    private readonly IUserService _userService;
    private readonly ILogger<UserNotificationHandler> _logger;
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions;
    private const string BaseApiUrl = "https://foo.client-craft.com/";
    private static readonly ConcurrentDictionary<string, bool> _processingUsers = new();

    private readonly AppCaches _appCaches;
    private readonly MediaFileManager _mediaFileManager;
    private readonly IImageUrlGenerator _imageUrlGenerator;
    private readonly IDomainService _domainService;

    public UserNotificationHandler(ILogger<UserNotificationHandler> logger, IUserService userService, AppCaches appCaches,
        MediaFileManager mediaFileManager, IImageUrlGenerator imageUrlGenerator, IDomainService domainService)
    {
        _domainService = domainService;
        _appCaches = appCaches;
        _mediaFileManager = mediaFileManager;
        _imageUrlGenerator = imageUrlGenerator;
        _logger = logger;
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(BaseApiUrl), Timeout = TimeSpan.FromSeconds(30)
        };
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        _userService = userService;
    }

    public async void Handle(UserSavedNotification notification)
    {
        foreach (IUser user in notification.SavedEntities)
        {
            IUser? dbUser = _userService.GetByEmail(user.Email);
            // Skip if this user is already being processed

            if (dbUser != null && !_processingUsers.TryAdd(dbUser.Email, true))
            {
                _logger.LogDebug("Skipping duplicate processing for user {UserEmail}", dbUser.Email);
                return;
            }

            IUser correctUser = dbUser!;

            try
            {
                UserModel? existingUser = await GetUserAsync(correctUser.Key.ToString());

                var avatarPath = user.GetUserAvatarUrls(_appCaches.RuntimeCache, _mediaFileManager, _imageUrlGenerator)
                    .FirstOrDefault(x => x.Contains("width=300"));

                string avatarUrl = _domainService.GetAll(false)
                    .FirstOrDefault()
                    ?.DomainName ?? string.Empty;

                avatarUrl += avatarPath;

                if (string.IsNullOrEmpty(avatarPath))
                {
                    avatarUrl = string.Empty;
                }

                if (existingUser == null)
                {
                    UserModel createRequest = new()
                    {
                        Name = correctUser.Name ?? string.Empty,
                        Email = correctUser.Email,
                        Reference = correctUser.Key,
                        Source = UserModelSource.Umbraco,
                        AvatarPath = avatarUrl
                    };

                    UserModel? createdUser = await CreateUserWithRetryAsync(createRequest);
                    _logger.LogInformation("User {User} created in ClientCraft with ID {Id}",
                    correctUser.Name, createdUser?.Id);
                }
                else
                {
                    UpdateUserRequest updateRequest = new()
                    {
                        _method = "PUT",
                        Name = correctUser.Name ?? string.Empty,
                        Email = correctUser.Email,
                        Reference = correctUser.Key,
                        Source = UserModelSource.Umbraco,
                        AvatarPath = avatarUrl
                    };

                    var updatedUser = await UpdateUserAsync(correctUser.Key.ToString(), updateRequest);
                    _logger.LogInformation("User {User} updated in ClientCraft", correctUser.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing user {User}", correctUser.Name);
            }
            finally
            {
                _processingUsers.TryRemove(correctUser.Email, out _);
            }
        }
    }

    public async void Handle(UserDeletingNotification notification)
    {
        foreach (IUser user in notification.DeletedEntities)
        {
            // Skip if this user is already being processed
            if (!_processingUsers.TryAdd(user.Email, true))
            {
                _logger.LogDebug("Skipping duplicate processing for user {UserEmail}", user.Email);
                return;
            }

            try
            {
                await DeleteUserAsync(user.Key.ToString());
                _logger.LogInformation("User {User} deleted from ClientCraft", user.Name);
            }
            catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                _logger.LogWarning("User {User} not found in ClientCraft", user.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {User}", user.Name);
            }
            finally
            {
                _processingUsers.TryRemove(user.Email, out _);
            }
        }
    }

    private async Task<UserModel?> CreateUserWithRetryAsync(UserModel user, int maxRetries = 2)
    {
        int attempt = 0;
        while (true)
        {
            try
            {
                return await CreateUserAsync(user);
            }
            catch (HttpRequestException ex) when (
                ex.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity &&
                ex.Message.Contains("email has already been taken") &&
                ++attempt < maxRetries)
            {
                // If email conflict, fetch the existing user and return it
                var existing = await GetUserByEmailAsync(user.Email);
                if (existing != null) return existing;

                await Task.Delay(100 * attempt);
            }
        }
    }

    private async Task<UserModel?> GetUserByEmailAsync(string email)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<UserModel>(
            $"user/by-email/{Uri.EscapeDataString(email)}",
            _jsonOptions);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    private async Task<UserModel?> GetUserAsync(string reference)
    {
        try
        {
            var response = await _httpClient.GetAsync($"user/{reference}");

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<UserModel>(_jsonOptions);
            }

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }

            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("Failed to get user. Status: {StatusCode}, Response: {ErrorContent}",
            response.StatusCode, errorContent);
            response.EnsureSuccessStatusCode();
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user with reference {Reference}", reference);
            throw;
        }
    }

    private async Task<UserModel?> CreateUserAsync(UserModel user)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("user", user, _jsonOptions);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to create user. Status: {StatusCode}, Response: {ErrorContent}",
                response.StatusCode, errorContent);

                if (response.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity)
                {
                    try
                    {
                        var validationErrors = JsonSerializer.Deserialize<ValidationErrorResponse>(errorContent, _jsonOptions);
                        _logger.LogError("Validation errors: {ValidationErrors}",
                        string.Join(", ", validationErrors?.Errors ?? new Dictionary<string, string[]>()));
                    }
                    catch (JsonException jsonEx)
                    {
                        _logger.LogError(jsonEx, "Failed to parse validation errors");
                    }
                }
            }

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<UserModel>(_jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user {User}", user.Name);
            throw;
        }
    }

    private async Task<UserModel?> UpdateUserAsync(string reference, UpdateUserRequest user)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync($"user/{reference}", user, _jsonOptions);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to update user. Status: {StatusCode}, Response: {ErrorContent}",
                response.StatusCode, errorContent);
            }

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<UserModel>(_jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user with reference {Reference}", reference);
            throw;
        }
    }

    private async Task DeleteUserAsync(string reference)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"user/{reference}");

            if (!response.IsSuccessStatusCode &&
                response.StatusCode != System.Net.HttpStatusCode.NotFound)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to delete user. Status: {StatusCode}, Response: {ErrorContent}",
                response.StatusCode, errorContent);
            }

            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user with reference {Reference}", reference);
            throw;
        }
    }

    public class ValidationErrorResponse
    {
        public string Message { get; set; }
        public Dictionary<string, string[]> Errors { get; set; }
    }
}

public class UserModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string AvatarPath { get; set; }
    public string Email { get; set; }
    public Guid Reference { get; set; }
    public string Source { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateUserRequest : UserModel
{
    public string _method { get; set; }
}

public static class UserModelSource
{
    public const string Umbraco = "umbraco";
    public const string Web = "web";
}
