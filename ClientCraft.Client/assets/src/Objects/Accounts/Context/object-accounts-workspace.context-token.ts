import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import UmbObjectAccountsWorkspaceContext from "./object-accounts-workspace.context.ts";

export const CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN = new UmbContextToken<
    UmbObjectAccountsWorkspaceContext
>(
    'my-accounts-context',
    undefined,
    (context): context is UmbObjectAccountsWorkspaceContext => context.getEntityType?.() === 'accounts',
);
 