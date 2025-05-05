using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using ClientCraft.uCRM.wwwroot.uCRM.NotificationHandlers;

namespace ClientCraft.uCRM;
internal class CrmComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.ManifestFilters().Append<CrmManifestFilter>();
        builder.AddNotificationHandler<UserSavedNotification, UserNotificationHandler>();
        builder.AddNotificationHandler<UserDeletingNotification, UserNotificationHandler>();
    }
}
