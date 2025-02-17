import { ManifestModal } from '@umbraco-cms/backoffice/modal';

const dialogs: Array<ManifestModal> = [{
        type: 'modal',
        alias: 'crm.deals.delete.modal',
        name: 'Delete deal modal',
        js: () => import('./delete-deal-dialog-element.ts')
    }];

export const deleteDealDialog: ManifestModal[] = [...dialogs];