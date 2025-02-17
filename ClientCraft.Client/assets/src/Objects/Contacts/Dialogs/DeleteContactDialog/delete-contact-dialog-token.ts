import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface DeleteContactDialogData {
    headline: string;
    deleteItemId: string;
}

export interface DeleteContactDialogValue {
    delete: boolean;
}

export const DELETE_CONTACT_MODAL = new UmbModalToken<DeleteContactDialogData, DeleteContactDialogValue>(
    "crm.contacts.delete.modal",
    {
        modal: {
            type: 'dialog', /// Here we can use "dialog" or "sidebar" according to how do we want this modal to be displayed. A "dialog" is a floating detached modal while a "sidebar" is a drawer
            size: 'medium'
        }
    }
);