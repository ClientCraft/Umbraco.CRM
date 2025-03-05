import {UmbModalToken} from "@umbraco-cms/backoffice/modal";
import {DealsService} from "../../Services/DealsService.ts";
import {getDealStatuses} from "../../../../api/laravel-api-client";

export interface CreateDealDialogData {
    headline: string;
    createItemId: string;
    _dealsContext: {
        deals: DealsService,
        dealStatus: {
            getDealStatuses: typeof getDealStatuses,
        }
    };
}

export interface CreateDealDialogValue {
    created: boolean;
}

export const CREATE_DEAL_MODAL = new UmbModalToken<CreateDealDialogData, CreateDealDialogValue>(
    "crm.deals.create.modal",
    {
        modal: {
            type: 'sidebar', /// Here we can use "dialog" or "sidebar" according to how do we want this modal to be displayed. A "dialog" is a floating detached modal while a "sidebar" is a drawer
            size: 'small' /// Here we can use "small", "medium" or "large" according to the size of the modal ?? 
        }
    }
);