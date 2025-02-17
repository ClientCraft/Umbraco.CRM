using ClientCraft.Core.Api;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

namespace ClientCraft.Core.NotificationHandlers;

public class UserNotificationHandler(ILogger<UserNotificationHandler> logger, ApiClient httpClient) : INotificationHandler<UserSavedNotification>, INotificationHandler<UserDeletedNotification>
{
    public async void Handle(UserSavedNotification notification)
    {
        foreach (var user in notification.SavedEntities)
        {
            UserModel? dbUser = null;
            try
            {
                dbUser = await httpClient.GetUserV2Async(reference: user.Key.ToString());
            }
            catch (Exception e)
            {
                // ignored
            }

            try
            {
                UserModel result;
                if (dbUser == null || dbUser.Reference == Guid.Empty)
                {
                    result = await httpClient.CreateUserV2Async(new UserModel
                    {
                        Name = user.Name,
                        Email = user.Email,
                        Reference = user.Key,
                        Source = UserModelSource.Umbraco
                    });
                }
                else
                {
                    result = await httpClient.UpdateUserV2Async(reference: user.Key.ToString(), body: new UpdateUserRequest()
                    {
                        _method = "PUT",
                        Name = user.Name,
                        Email = user.Email,
                        Reference = user.Key,
                        Source = UserModelSource.Umbraco
                    });
                }
            
                // Write to the logs every time a user is saved.
                logger.LogInformation("User {user} has been saved and synchronized with Laravel! With message {message} ", user.Name, result);
            }
            catch (HttpRequestException ex)
            {
                // Handle the HTTP request error
                Console.WriteLine($"HTTP request error: {ex.Message}");
                // You can also log the error or return a specific response
            }
            catch (Exception ex)
            {
                // Handle any other exceptions
                Console.WriteLine($"An error occurred: {ex.Message}");
                // Log the exception or take other actions as needed
            }
        }
    }

    public void Handle(UserDeletedNotification notification)
    {
        foreach (var user in notification.DeletedEntities)
        {
            httpClient.DeleteUserV2Async(reference: user.Key.ToString());
            // Write to the logs every time a user is saved.
            logger.LogInformation("User {user} has been saved and notification published!", user.Name);
        }
    }
}
