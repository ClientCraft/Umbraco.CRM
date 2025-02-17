// @ts-nocheck
import { ManifestWorkspace } from "@umbraco-cms/backoffice/workspace";
import { contactDialogs } from "./Dialogs";
import { ManifestMenuItem } from "@umbraco-cms/backoffice/menu";

const workspaces : ManifestWorkspace[] = [{
    type: 'workspace',
    kind: 'routable',
    alias: 'ClientCraft.workspace.contacts',
    name: 'Contacts workspace',
    api: () => import('./Context/object-contacts-workspace.context.ts'),
    meta: {
        entityType: 'contacts'
    }
}];

const menuItems: ManifestMenuItem[] = [{
    type: 'menuItem',
    alias: 'ClientCraft.menuItem.contacts',
    name: 'contact menu item',
    meta: {
        label: 'Contacts',
        icon: 'icon-users',
        entityType: 'contacts',
        menus: [
            'ClientCraft.menu'
        ]
    }
}];

export const contactsManifests = [
    ...menuItems,
    ...workspaces,
    ...contactDialogs
];