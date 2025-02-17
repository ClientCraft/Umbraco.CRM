import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface DeleteAccountDialogData {
    headline: string;
    deleteItemId: string;
}

export interface DeleteAccountDialogValue {
    delete: boolean;
}

export const DELETE_ACCOUNT_MODAL = new UmbModalToken<DeleteAccountDialogData, DeleteAccountDialogValue>(
    "crm.accounts.delete.modal",
    {
        modal: {
            type: 'dialog', /// Here we can use "dialog" or "sidebar" according to how do we want this modal to be displayed. A "dialog" is a floating detached modal while a "sidebar" is a drawer
            size: 'medium'
        }
    }
);