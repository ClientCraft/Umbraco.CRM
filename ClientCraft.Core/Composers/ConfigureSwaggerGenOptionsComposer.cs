using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace ClientCraft.Core.Composers;


//Necessary code for the new API to show in the Swagger documentation and Swagger UI
public class ClientCraftBackOfficeSecurityRequirementsOperationFilter : BackOfficeSecurityRequirementsOperationFilterBase
{
    protected override string ApiName => "client-craft";
}

internal class ConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.SwaggerDoc(
            "ClientCraft",
            new OpenApiInfo
            {
                Title = "Client Craft Api",
                Version = "Latest",
                Description = "Api for Client Craft CRM"
            });

        options.OperationFilter<ClientCraftBackOfficeSecurityRequirementsOperationFilter>();
    }
}

public class ClientCraftSwaggerComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.ConfigureOptions<ConfigureSwaggerGenOptions>();
    }
}