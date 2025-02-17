import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import {ContactsService} from "../../../Contacts/Services/ContactsService.ts";
import {AccountsService} from "../../../Accounts/Services/AccountsService.ts";
import {DealsService} from "../../../Deals/Services/DealsService.ts";
import { LeadModel } from "../../../../api/laravel-api-client/types.gen.ts";
import {LeadsService} from "../../Services/LeadsService.ts";

export interface ConvertLeadDialogData {
    headline: string;
    _leadsService: LeadsService,
    _contactsService: ContactsService,
    _accountsService: AccountsService,
    _dealsService: DealsService,
    leadToConvert: LeadModel
}

export interface ConvertLeadDialogValue {
    cancel?: boolean;
    converted?: boolean;
    errorMessage?: boolean;
}

export const CONVERT_LEAD_MODAL = new UmbModalToken<ConvertLeadDialogData, ConvertLeadDialogValue>(
    "crm.leads.convert.modal",
    {
        modal: {
            type: 'dialog', /// Here we can use "dialog" or "sidebar" according to how do we want this modal to be displayed. A "dialog" is a floating detached modal while a "sidebar" is a drawer
            size: 'medium'
        }
    }
);