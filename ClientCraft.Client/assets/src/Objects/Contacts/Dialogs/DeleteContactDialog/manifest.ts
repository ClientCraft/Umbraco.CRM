import { ManifestModal } from '@umbraco-cms/backoffice/modal';

const dialogs: Array<ManifestModal> = [{
        type: 'modal',
        alias: 'crm.contacts.delete.modal',
        name: 'Delete contact modal',
        js: () => import('./delete-contact-dialog-element.ts')
    }];

export const deleteContactDialog: ManifestModal[] = [...dialogs];