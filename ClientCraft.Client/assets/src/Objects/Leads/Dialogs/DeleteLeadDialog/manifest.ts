import { ManifestModal } from '@umbraco-cms/backoffice/modal';

const dialogs: Array<ManifestModal> = [
    {
        type: 'modal',
        alias: 'crm.leads.delete.modal',
        name: 'Delete lead modal',
        js: () => import('./delete-lead-dialog-element.ts')
    }
];

export const deleteLeadDialog = [...dialogs];