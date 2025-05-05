using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Actions;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models.Trees;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Trees;
using Umbraco.Cms.Web.BackOffice.Trees;
using Umbraco.Cms.Web.Common.Attributes;
using Umbraco.Extensions;

namespace ClientCraft.uCRM.wwwroot.Trees;

[Tree("ClientCraft.uCRM", "contacts", TreeTitle = "Contacts", TreeGroup = "crmItemsGroup", SortOrder = 2)]
[PluginController("uCRM")]
public class ContactsTreeController : TreeController
{

    private readonly IMenuItemCollectionFactory _menuItemCollectionFactory;

    public ContactsTreeController(ILocalizedTextService localizedTextService,
        UmbracoApiControllerTypeCollection umbracoApiControllerTypeCollection,
        IMenuItemCollectionFactory menuItemCollectionFactory,
        IEventAggregator eventAggregator)
        : base(localizedTextService, umbracoApiControllerTypeCollection, eventAggregator) => _menuItemCollectionFactory = menuItemCollectionFactory ?? throw new ArgumentNullException(nameof(menuItemCollectionFactory));

    protected override ActionResult<TreeNodeCollection> GetTreeNodes(string id, FormCollection queryStrings)
    {
       return new TreeNodeCollection();
    }

    protected override ActionResult<MenuItemCollection> GetMenuForNode(string id, FormCollection queryStrings)
    {
        // create a Menu Item Collection to return so people can interact with the nodes in your tree
        var menu = _menuItemCollectionFactory.Create();
        return menu;

    }

    protected override ActionResult<TreeNode> CreateRootNode(FormCollection queryStrings)
    {
        var rootResult = base.CreateRootNode(queryStrings);
        if (!(rootResult.Result is null))
        {
            return rootResult;
        }

        var root = rootResult.Value;

        //optionally setting a routepath would allow you to load in a custom UI instead of the usual behaviour for a tree
        root.RoutePath = string.Format("{0}/{1}/{2}", "ClientCraft.uCRM", "contacts", "overview");
        // set the icon
        root.Icon = "icon-hearts";
        // set to false for a custom tree with a single node.
        root.HasChildren = false;
        //url for menu
        root.MenuUrl = null;

        return root;
    }
}
