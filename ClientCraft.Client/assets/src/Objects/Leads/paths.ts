import { UmbPathPattern } from '@umbraco-cms/backoffice/router';
import { UMB_WORKSPACE_PATH_PATTERN } from '@umbraco-cms/backoffice/workspace';

export const UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_TEMPLATE = 'template';
export const UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_ELEMENT = 'element';

export type UmbCreateDocumentTypeWorkspacePresetTemplateType =
    typeof UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_TEMPLATE;
export type UmbCreateDocumentTypeWorkspacePresetElementType = // line break thanks!
    typeof UMB_CREATE_DOCUMENT_TYPE_WORKSPACE_PRESET_ELEMENT;

export type UmbCreateDocumentTypeWorkspacePresetType =
    | UmbCreateDocumentTypeWorkspacePresetTemplateType
    | UmbCreateDocumentTypeWorkspacePresetElementType;

export const CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_PATH = UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
    sectionName: 'client-craft',
    entityType: 'leads',
});

export const CLIENTCRAFT_CREATE_LEADS_WORKSPACE_PATH_PATTERN = new UmbPathPattern('create/', 'leads');

export const CLIENTCRAFT_EDIT_OBJECT_LEADS_WORKSPACE_PATH_PATTERN = new UmbPathPattern<{ unique: string }>(
    'edit/:unique',
    'leads',
);