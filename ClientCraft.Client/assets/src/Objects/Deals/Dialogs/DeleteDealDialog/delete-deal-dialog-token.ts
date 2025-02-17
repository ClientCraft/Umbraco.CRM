import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface DeleteDealDialogData {
    headline: string;
    deleteItemId: string;
}

export interface DeleteDealDialogValue {
    delete: boolean;
}

export const DELETE_DEAL_MODAL = new UmbModalToken<DeleteDealDialogData, DeleteDealDialogValue>(
    "crm.deals.delete.modal",
    {
        modal: {
            type: 'dialog', /// Here we can use "dialog" or "sidebar" according to how do we want this modal to be displayed. A "dialog" is a floating detached modal while a "sidebar" is a drawer
            size: 'medium'
        }
    }
);