using Umbraco.Cms.Core.Manifest;

namespace Umbraco.Community.Umbraco.Crm;

internal class CrmManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        var assembly = typeof(CrmManifestFilter).Assembly;

        var packageManifest = new PackageManifest
        {
            PackageName = "Umbraco.Crm",
            Version = assembly.GetName()?.Version?.ToString(3) ?? "0.1.0",
            AllowPackageTelemetry = true,
            Scripts = new string[]
            {
                    // List any Script files
                // Urls should start '/App_Plugins/Umbraco.Crm/' not '/wwwroot/Umbraco.Crm/', e.g.
                "/App_Plugins/Umbraco.Crm/app/app.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/lead/list/lead-list.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/deal/list/deal-list.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/contact/list/contact-list.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/account/list/account-list.component.js",
                "/App_Plugins/UmbracoCrm/backoffice/accounts/overview.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/overview.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/deals/overview.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/overview.controller.js",
                
            },
            Stylesheets = new string[]
            {
                // List any Stylesheet files
                // Urls should start '/App_Plugins/Umbraco.Crm/' not '/wwwroot/Umbraco.Crm/', e.g.
                // "/App_Plugins/Umbraco.Crm/Styles/styles.css"
            },
            Sections =
            [
                new ManifestSection
                {
                    Alias = "Umbraco.Crm", Name = "CRM"
                }
            ],
            Dashboards =
            [
                new ManifestDashboard
                {
                    Alias = "Umbraco.Crm.Main.Dashboard", View = "/App_Plugins/Umbraco.Crm/index.html", Sections = ["Umbraco.Crm"], Weight = 10
                }
            ]
        };

        manifests.Add(packageManifest);
    }
}
