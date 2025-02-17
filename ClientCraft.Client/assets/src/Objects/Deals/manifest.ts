import { ManifestWorkspace } from "@umbraco-cms/backoffice/workspace";
import { dealDialogs } from "./Dialogs";
import { ManifestMenuItem } from "@umbraco-cms/backoffice/menu";

const workspaces : ManifestWorkspace[] = [{
    type: 'workspace',
    kind: 'routable',
    alias: 'ClientCraft.workspace.deals',
    name: 'Deals workspace',
    api: () => import('./Context/object-deals-workspace.context.ts'),
    meta: {
        entityType: 'deals'
    }
}];

const menuItems: ManifestMenuItem[] = [{
    type: 'menuItem',
    alias: 'ClientCraft.menuItem.deals',
    name: 'deal menu item',
    meta: {
        label: 'Deals',
        icon: 'icon-users',
        entityType: 'deals',
        menus: [
            'ClientCraft.menu'
        ]
    }
}];

export const dealsManifests = [
    ...menuItems,
    ...workspaces,
    ...dealDialogs
];