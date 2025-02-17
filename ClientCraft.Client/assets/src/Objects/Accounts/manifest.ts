// @ts-nocheck
import { ManifestMenuItem, ManifestWorkspace } from '@umbraco-cms/backoffice/extension-registry';
import { accountDialogs } from "./Dialogs";

const workspaces : ManifestWorkspace[] = [{
    type: 'workspace',
    kind: 'routable',
    alias: 'ClientCraft.workspace.accounts',
    name: 'Accounts workspace',
    api: () => import('./Context/object-accounts-workspace.context.ts'),
    meta: {
        entityType: 'accounts'
    }
}];

const menuItems: ManifestMenuItem[] = [{
    type: 'menuItem',
    alias: 'ClientCraft.menuItem.accounts',
    name: 'account menu item',
    meta: {
        label: 'Accounts',
        icon: 'icon-briefcase',
        entityType: 'accounts',
        menus: [
            'ClientCraft.menu'
        ]
    }
}];

export const accountsManifests = [
    ...menuItems,
    ...workspaces,
    ...accountDialogs
];