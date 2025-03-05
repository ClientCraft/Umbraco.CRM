import { ManifestModal } from '@umbraco-cms/backoffice/modal';

const dialogs: Array<ManifestModal> = [{
        type: 'modal',
        alias: 'crm.deals.create.modal',
        name: 'Create deal modal',
        js: () => import('./create-deal-dialog-element.ts')
    }];

export const createDealDialog: ManifestModal[] = [...dialogs];