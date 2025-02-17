using ClientCraft.Core.Api;
using System.Net.Http;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

namespace ClientCraft.Core.Composers;

public class ApiClientComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        // Register the ApiClient with required dependencies
        builder.Services.AddSingleton<ApiClient>(serviceProvider =>
        {
            var httpClientFactory = serviceProvider.GetRequiredService<IHttpClientFactory>();
            var httpClient = httpClientFactory.CreateClient(); // Create a new HttpClient instance
            const string baseUrl = "http://foo.localhost:8000"; // Replace with your API base URL
            
            return new ApiClient(baseUrl, httpClient);
        });
    }
}
