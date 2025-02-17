import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import UmbObjectContactsWorkspaceContext from "./object-contacts-workspace.context.ts";

export const CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN = new UmbContextToken<
    UmbObjectContactsWorkspaceContext
>(
    'my-contacts-context',
    undefined,
    (context): context is UmbObjectContactsWorkspaceContext => context.getEntityType?.() === 'contacts',
);
 