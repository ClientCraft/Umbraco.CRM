import { ManifestModal } from '@umbraco-cms/backoffice/modal';

const dialogs: Array<ManifestModal> = [
    {
        type: 'modal',
        alias: 'crm.leads.convert.modal',
        name: 'Convert lead modal',
        js: () => import('./convert-lead-dialog-element.ts')
    }
];

export const convertLeadDialog = [...dialogs];