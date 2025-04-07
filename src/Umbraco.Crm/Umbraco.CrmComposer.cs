using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Umbraco.Community.Umbraco.Crm
{
    internal class Umbraco.CrmComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.ManifestFilters().Append<Umbraco.CrmManifestFilter>();
        }
    }
}
