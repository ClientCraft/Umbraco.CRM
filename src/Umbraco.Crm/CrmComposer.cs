using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Community.Umbraco.Crm.wwwroot.UmbracoCrm.NotificationHandlers;

namespace Umbraco.Community.Umbraco.Crm;
internal class CrmComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.ManifestFilters().Append<CrmManifestFilter>();
        builder.AddNotificationHandler<UserSavedNotification, UserNotificationHandler>();
        builder.AddNotificationHandler<UserDeletingNotification, UserNotificationHandler>();
    }
}
