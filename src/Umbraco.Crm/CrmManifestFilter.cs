using Umbraco.Cms.Core.Manifest;

namespace Umbraco.Community.Umbraco.Crm;
internal class CrmManifestFilter : IManifestFilter
{
    public void Filter(List<PackageManifest> manifests)
    {
        var assembly = typeof(CrmManifestFilter).Assembly;

        manifests.Add(new PackageManifest
        {
            PackageName = "Umbraco.Crm",
            Version = assembly.GetName()?.Version?.ToString(3) ?? "0.1.0",
            AllowPackageTelemetry = true,
            Scripts = new string[] {
                // List any Script files
                // Urls should start '/App_Plugins/Umbraco.Crm/' not '/wwwroot/Umbraco.Crm/', e.g.
                // "/App_Plugins/Umbraco.Crm/Scripts/scripts.js"
            },
            Stylesheets = new string[]
            {
                // List any Stylesheet files
                // Urls should start '/App_Plugins/Umbraco.Crm/' not '/wwwroot/Umbraco.Crm/', e.g.
                // "/App_Plugins/Umbraco.Crm/Styles/styles.css"
            }
        });
    }
}
