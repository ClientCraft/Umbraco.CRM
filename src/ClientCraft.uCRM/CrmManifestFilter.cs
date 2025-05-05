using Umbraco.Cms.Core.Manifest;
using System.Collections.Generic;

namespace ClientCraft.uCRM;

internal class CrmManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        var assembly = typeof(CrmManifestFilter).Assembly;

        var packageManifest = new PackageManifest
        {
            PackageName = "ClientCraft.uCRM",
            Version = assembly.GetName()?.Version?.ToString(3) ?? "0.1.0",
            AllowPackageTelemetry = true,
            Scripts =
            [
                // List any Script files
                // Urls should start '/App_Plugins/ClientCraft.uCRM/' not '/wwwroot/ClientCraft.uCRM/', e.g.
                "/App_Plugins/uCRM/backoffice/leads/overview.controller.js",
                "/App_Plugins/uCRM/backoffice/leads/create.controller.js",
                "/App_Plugins/uCRM/backoffice/leads/edit.controller.js",
                "/App_Plugins/uCRM/backoffice/leads/view.controller.js",
                "/App_Plugins/uCRM/backoffice/dialogs/seeAllNotes/seeAllNotes.controller.js",
                "/App_Plugins/uCRM/backoffice/dialogs/seeAllDeals/seeAllDeals.controller.js",
                "/App_Plugins/uCRM/backoffice/dialogs/deleteLead/deleteLead.controller.js",
                "/App_Plugins/uCRM/backoffice/contacts/edit.controller.js",
                "/App_Plugins/uCRM/backoffice/contacts/view.controller.js",
                "/App_Plugins/uCRM/backoffice/notes/create.controller.js",
                "/App_Plugins/uCRM/backoffice/deals/create.controller.js",
                "/App_Plugins/uCRM/backoffice/components/tag-input/tag-input.component.js",
                "/App_Plugins/uCRM/backoffice/components/avatar-display/avatar-display.component.js",
                "/App_Plugins/uCRM/backoffice/components/select-input/select-input.component.js",
                "/App_Plugins/uCRM/backoffice/sidebars/editTask/edit.controller.js",
                "/App_Plugins/uCRM/backoffice/sidebars/createTask/create.controller.js"
            ],
            Stylesheets =
            [
                // List any Stylesheet files
                // Urls should start '/App_Plugins/ClientCraft.uCRM/' not '/wwwroot/ClientCraft.uCRM/', e.g.
                // "/App_Plugins/ClientCraft.uCRM/Styles/styles.css"
                "/App_Plugins/uCRM/backoffice/leads/overview.css",
                "/App_Plugins/uCRM/backoffice/leads/create.css",
                "/App_Plugins/uCRM/backoffice/leads/edit.css",
                "/App_Plugins/uCRM/backoffice/leads/view.css",
                "/App_Plugins/uCRM/backoffice/dialogs/seeAllNotes/seeAllNotes.css",
                "/App_Plugins/uCRM/backoffice/dialogs/seeAllDeals/seeAllDeals.css",
                "/App_Plugins/uCRM/backoffice/dialogs/deleteLead/deleteLead.css",
                "/App_Plugins/uCRM/backoffice/contacts/edit.css",
                "/App_Plugins/uCRM/backoffice/contacts/view.css",
                "/App_Plugins/uCRM/backoffice/notes/create.css",
                "/App_Plugins/uCRM/backoffice/deals/create.css",
                "/App_Plugins/uCRM/backoffice/components/tag-input/tag-input.css",
                "/App_Plugins/uCRM/backoffice/components/avatar-display/avatar-display.css",
                "/App_Plugins/uCRM/backoffice/sidebars/editTask/edit.css",
                "/App_Plugins/uCRM/backoffice/sidebars/createTask/create.css",


            ],
            Sections =
            [
                new ManifestSection
                {
                    Alias = "ClientCraft.uCRM", Name = "CRM"
                }
            ],
            Dashboards =
            [
                new ManifestDashboard
                {
                    Alias = "ClientCraft.uCRM.Main.Dashboard", View = "/App_Plugins/uCRM/backoffice/index.html", Sections = ["ClientCraft.uCRM"], Weight = 10
                }
            ]
        };

        manifests.Add(packageManifest);
    }
}
