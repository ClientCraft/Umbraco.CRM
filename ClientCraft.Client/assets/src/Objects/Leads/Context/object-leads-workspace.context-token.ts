import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import UmbObjectLeadsWorkspaceContext from "./object-leads-workspace.context.ts";

export const CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN = new UmbContextToken<
    UmbObjectLeadsWorkspaceContext
>(
    'my-leads-context',
    undefined,
    (context): context is UmbObjectLeadsWorkspaceContext => context.getEntityType?.() === 'leads',
);
 