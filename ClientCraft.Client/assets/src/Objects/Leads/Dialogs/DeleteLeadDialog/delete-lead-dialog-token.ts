import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface DeleteLeadDialogData {
    headline: string;
    deleteItemId: string;
}

export interface DeleteLeadDialogValue {
    delete: boolean;
}

export const DELETE_LEAD_MODAL = new UmbModalToken<DeleteLeadDialogData, DeleteLeadDialogValue>(
    "crm.leads.delete.modal",
    {
        modal: {
            type: 'dialog', /// Here we can use "dialog" or "sidebar" according to how do we want this modal to be displayed. A "dialog" is a floating detached modal while a "sidebar" is a drawer
            size: 'medium'
        }
    }
);