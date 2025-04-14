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
            Scripts =
            [
                // List any Script files
                // Urls should start '/App_Plugins/Umbraco.Crm/' not '/wwwroot/Umbraco.Crm/', e.g.
                "/App_Plugins/Umbraco.Crm/app/app.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/lead/list/lead-list.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/deal/list/deal-list.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/contact/list/contact-list.component.js",
                "/App_Plugins/Umbraco.Crm/app/components/account/list/account-list.component.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/overview.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/create.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/edit.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/view.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/notes.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/edit.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/view.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/notes/create.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/components/tag-input/tag-input.component.js",
                "/App_Plugins/UmbracoCrm/backoffice/components/avatar-display/avatar-display.component.js",
            ],
            Stylesheets =
            [
                // List any Stylesheet files
                // Urls should start '/App_Plugins/Umbraco.Crm/' not '/wwwroot/Umbraco.Crm/', e.g.
                // "/App_Plugins/Umbraco.Crm/Styles/styles.css"
                "/App_Plugins/UmbracoCrm/backoffice/leads/overview.css",
                "/App_Plugins/UmbracoCrm/backoffice/leads/create.css",
                "/App_Plugins/UmbracoCrm/backoffice/leads/edit.css",
                "/App_Plugins/UmbracoCrm/backoffice/leads/view.css",
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/notes.css",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/edit.css",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/view.css",
                "/App_Plugins/UmbracoCrm/backoffice/notes/create.css",
                "/App_Plugins/UmbracoCrm/backoffice/components/tag-input/tag-input.css",
                "/App_Plugins/UmbracoCrm/backoffice/components/avatar-display/avatar-display.css",

            ],
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
