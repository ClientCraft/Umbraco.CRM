import { ManifestModal } from '@umbraco-cms/backoffice/modal';


const dialogs: Array<ManifestModal> = [{
        type: 'modal',
        alias: 'crm.account.delete.modal',
        name: 'Delete account modal',
        js: () => import('./delete-account-dialog-element.ts')
    }];

export const deleteAccountDialog: ManifestModal[] = [...dialogs];