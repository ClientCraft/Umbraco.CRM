using ClientCraft.Core.NotificationHandlers;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;

namespace ClientCraft.Core.Composers;

public class NotificationComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.AddNotificationHandler<UserSavedNotification, UserNotificationHandler>();
        builder.AddNotificationHandler<UserDeletedNotification, UserNotificationHandler>();
    }
}
