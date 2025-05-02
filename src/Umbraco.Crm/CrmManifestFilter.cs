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
                "/App_Plugins/UmbracoCrm/backoffice/leads/overview.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/create.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/edit.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/leads/view.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/seeAllNotes/seeAllNotes.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/seeAllDeals/seeAllDeals.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/deleteLead/deleteLead.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/edit.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/view.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/notes/create.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/deals/create.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/components/tag-input/tag-input.component.js",
                "/App_Plugins/UmbracoCrm/backoffice/components/avatar-display/avatar-display.component.js",
                "/App_Plugins/UmbracoCrm/backoffice/components/select-input/select-input.component.js",
                "/App_Plugins/UmbracoCrm/backoffice/sidebars/editTask/edit.controller.js",
                "/App_Plugins/UmbracoCrm/backoffice/sidebars/createTask/create.controller.js"
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
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/seeAllNotes/seeAllNotes.css",
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/seeAllDeals/seeAllDeals.css",
                "/App_Plugins/UmbracoCrm/backoffice/dialogs/deleteLead/deleteLead.css",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/edit.css",
                "/App_Plugins/UmbracoCrm/backoffice/contacts/view.css",
                "/App_Plugins/UmbracoCrm/backoffice/notes/create.css",
                "/App_Plugins/UmbracoCrm/backoffice/deals/create.css",
                "/App_Plugins/UmbracoCrm/backoffice/components/tag-input/tag-input.css",
                "/App_Plugins/UmbracoCrm/backoffice/components/avatar-display/avatar-display.css",
                "/App_Plugins/UmbracoCrm/backoffice/sidebars/editTask/edit.css",
                "/App_Plugins/UmbracoCrm/backoffice/sidebars/createTask/create.css",


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
                    Alias = "Umbraco.Crm.Main.Dashboard", View = "/App_Plugins/UmbracoCrm/backoffice/index.html", Sections = ["Umbraco.Crm"], Weight = 10
                }
            ]
        };

        manifests.Add(packageManifest);
    }
}
