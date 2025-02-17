import { UmbPathPattern } from '@umbraco-cms/backoffice/router';
import { UMB_WORKSPACE_PATH_PATTERN } from '@umbraco-cms/backoffice/workspace';

// const UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_TEMPLATE = 'template';
// const UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_ELEMENT = 'element';
// export type UmbCreateDocumentTypeWorkspacePresetTemplateType =
//     typeof UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_TEMPLATE;
// export type UmbCreateDocumentTypeWorkspacePresetElementType = // line break thanks!
//     typeof UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_ELEMENT;
//
// export type UmbCreateDocumentTypeWorkspacePresetType =
//     | UmbCreateDocumentTypeWorkspacePresetTemplateType
//     | UmbCreateDocumentTypeWorkspacePresetElementType;

export const CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_PATH = UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
    sectionName: 'client-craft',
    entityType: 'contacts',
});

export const CLIENTCRAFT_CREATE_CONTACTS_WORKSPACE_PATH_PATTERN = new UmbPathPattern('create/', 'contacts');

export const CLIENTCRAFT_EDIT_OBJECT_CONTACTS_WORKSPACE_PATH_PATTERN = new UmbPathPattern<{ unique: string }>(
    'edit/:unique',
    'contacts',
);