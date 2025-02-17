import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import UmbObjectDealsWorkspaceContext from "./object-deals-workspace.context.ts";

export const CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN = new UmbContextToken<
    UmbObjectDealsWorkspaceContext
>(
    'my-deals-context',
    undefined,
    (context): context is UmbObjectDealsWorkspaceContext => context.getEntityType?.() === 'deals',
);
 