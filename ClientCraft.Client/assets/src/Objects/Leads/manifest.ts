import { ManifestWorkspace } from "@umbraco-cms/backoffice/workspace";
import {dialogs} from "./Dialogs";
import { ManifestMenuItem } from "@umbraco-cms/backoffice/menu";

const workspaces : ManifestWorkspace[] = [{
    type: 'workspace',
    kind: 'routable',
    alias: 'ClientCraft.workspace.leads',
    name: 'Leads workspace',
    api: () => import('./Context/object-leads-workspace.context.ts'),
    meta: {
        entityType: 'leads'
    }
}];

const menuItems: ManifestMenuItem[] = [{
    type: 'menuItem',
    alias: 'ClientCraft.menuItem.leads',
    name: 'time menu item',
    meta: {
        label: 'Leads',
        icon: 'icon-target',
        entityType: 'leads',
        menus: [
            'ClientCraft.menu'
        ]
    }
}];

export const leadsManifests = [
    ...workspaces,
    ...menuItems,
    ...dialogs
];