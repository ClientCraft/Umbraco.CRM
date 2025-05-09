// @ts-nocheck
import { ManifestWorkspace } from "@umbraco-cms/backoffice/workspace";

// const workspaceActions : ManifestWorkspaceAction[] = [{
//     type: 'workspaceAction',
//     alias: 'time.workspace.action',
//     name: 'time workspace action',
//     api: TimeAction,
//     meta: {
//         label: 'Time Action',
//         look: 'primary',
//         color: 'default',
//     },
//     conditions: [
//         {
//             alias: 'Umb.Condition.WorkspaceAlias',
//             match: 'Umb.Workspace.Document'
//         }
//     ]
// }];

const workspaces : ManifestWorkspace[] = [];
export const manifests = [
    ...workspaces,
    // ...workspaceActions
];

// TODO: This is how we do redirects on umbraco (USING UMBRACO ROUTER)
// import { UMB_DATA_TYPE_ENTITY_TYPE, UMB_DATA_TYPE_ROOT_ENTITY_TYPE } from './entity.js';
// import { UMB_WORKSPACE_PATH_PATTERN } from '@umbraco-cms/backoffice/workspace';
// import { UMB_SETTINGS_SECTION_PATHNAME } from '@umbraco-cms/backoffice/settings';
// import { UmbPathPattern } from '@umbraco-cms/backoffice/router';
// import type { UmbEntityModel } from '@umbraco-cms/backoffice/entity';
//
// export const UMB_DATA_TYPE_WORKSPACE_PATH = UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
//     sectionName: UMB_SETTINGS_SECTION_PATHNAME,
//     entityType: UMB_DATA_TYPE_ENTITY_TYPE,
// });
//
// export const UMB_DATA_TYPE_ROOT_WORKSPACE_PATH = UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
//     sectionName: UMB_SETTINGS_SECTION_PATHNAME,
//     entityType: UMB_DATA_TYPE_ROOT_ENTITY_TYPE,
// });
//
// export const UMB_CREATE_DATA_TYPE_WORKSPACE_PATH_PATTERN = new UmbPathPattern<{
//     parentEntityType: UmbEntityModel['entityType'];
//     parentUnique: UmbEntityModel['unique'];
// }>('create/parent/:parentEntityType/:parentUnique', UMB_DATA_TYPE_WORKSPACE_PATH);