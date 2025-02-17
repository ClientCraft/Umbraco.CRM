// @ts-nocheck
import {customElement, html, css, state, query, when} from "@umbraco-cms/backoffice/external/lit";
import {UmbModalBaseElement} from "@umbraco-cms/backoffice/modal";
import {ConvertLeadDialogData, ConvertLeadDialogValue} from "./convert-lead-dialog-token.ts";
import { UUIInputElement } from "@umbraco-ui/uui";
import {LeadModel} from "../../../../api/laravel-api-client";
// import {CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN} from "../../../Accounts";
// import UmbObjectAccountsWorkspaceContext from "../../../Accounts/Context/object-accounts-workspace.context.ts";

@customElement('convert-leads-modal')
export class ConvertLeadsModal extends UmbModalBaseElement<ConvertLeadDialogData, ConvertLeadDialogValue> {
    constructor() {
        super();
    }

    async connectedCallback() {
        super.connectedCallback();
        
        const [accountNamesResponse, contactNamesResponse, dealNamesResponse] = await Promise.all([
            this.data?._accountsService?.getAccountNames(),
            this.data?._contactsService.getContactNames(),
            this.data?._dealsService?.getDealNames()
        ]);

        if (!contactNamesResponse || Array.isArray(contactNamesResponse) && !contactNamesResponse?.length) {
            this.chooseExistingContactReadonly = true;
        } else {
            this.chooseExistingContactOptions = contactNamesResponse;
        }

        if (!dealNamesResponse || Array.isArray(dealNamesResponse) && !dealNamesResponse?.length) {
            this.chooseExistingDealReadonly = true;
        } else {
            this.chooseExistingDealOptions = dealNamesResponse;
        }
        
        if (!accountNamesResponse || Array.isArray(accountNamesResponse) && !accountNamesResponse?.length) {
            this.chooseExistingAccountReadonly = true;
        } else {
            this.chooseExistingAccountOptions = accountNamesResponse;
        }
    }

    @state()
    selectedAccount: number | undefined;
    
    @state()
    selectedDeal: number | undefined;
    
    @state()
    selectedContact: number | undefined;

    #handleCancel() {
        this.value = { cancel: true };
        this.modalContext?.submit();
    }
    
    @state()
    chooseExistingDealOptions: any = null;
    @state()
    chooseExistingDealReadonly = false;
    @state()
    existingDealOptionsPlaceholder?: string;
    
    @state()
    chooseExistingAccountOptions: any = null;
    @state()
    chooseExistingAccountReadonly = false;
    @state()
    existingAccountOptionsPlaceholder?: string;
    
    @state()
    chooseExistingContactOptions: any = null;
    @state()
    chooseExistingContactReadonly = false;
    @state()
    existingContactOptionsPlaceholder?: string;

    static styles = [
        css`
            .object-convert-radio-option {
                grid-column-gap: 10px;    
            }
            
            uui-input {
                &(:not([pristine]):invalid) {
                    display: none;
                }
            }
            
            .flex-column {
                flex-direction: column;
            }

            .social-icons {
                fill: var(--uui-color-default);
            }

            .social-icons:hover {
                transform: scale(1.1);
                cursor: pointer;
            }

            .p-10 {
                padding: 10px;
            }

            .p-15 {
                padding: 15px;
            }

            .grid-container {
                display: grid;
                grid-column-gap: 10px;
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: auto;
            }

            .grid-item {
                display: grid;
                grid-row: span 3;
                grid-row-gap: 10px;
                grid-column: span 2;
                grid-template-rows: subgrid; /* This makes the child inherit the parent grid */
            }

            .m-0 {
                margin: 0;
            }

            .bg-white {
                background-color: white;
            }

            uui-input {
                border: none;
                background: transparent;
            }

            .p-20 {
                padding: 20px;
            }

            .grid {
                display: grid;
            }

            .grid-cols-12 {
                grid-template-columns: repeat(12, 1fr);
            }

            .column-gap-10 {
                grid-column-gap: 10px;
            }

            .grid-cols-3 {
                grid-template-columns: repeat(3, 1fr);
            }

            .grid-cols-2 {
                grid-template-columns: repeat(2, 1fr);
            }

            .grid-cols-20-80 {
                grid-template-columns: repeat(12, 1fr);
                grid-column-gap: 10px;

                & > div:first-child {
                    grid-column: span 2;
                }

                & > *:not(:first-child) {
                    grid-column: span 10;
                }
            }

            .grid-col-span-8 {
                grid-column: span 8;
            }

            .grid-col-span-4 {
                grid-column: span 4;
            }

            .gap-5 {
                gap: 5px;
            }

            .gap-15 {
                gap: 15px;
            }

            .flex {
                display: flex;
            }

            .flex-wrap {
                flex-wrap: wrap;
            }

        [ id $= "-label" ] {
            font-weight: bold;
        }

            uui-box {
                margin-bottom: 10px;
            }

            igc-step::part(body) {
                display: none;
            }

            igc-step::part(indicator) {
                display: none;
            }

            igc-step {
                --separator-size: 0;
            }

            .object-convert-options-container {
                padding: 10px;
                background-color: lightgrey;
            }

            uui-input {
                background-color: white;
                
                &[error] {
                    /* Your styles here */
                    border: 2px solid red;
                    background-color: #ffe6e6; /* Light red background */
                }
            }
        `,
    ];
    
    @query('#create-new-account')
    createNewAccountInput: UUIInputElement | undefined;
    @state()
    accountRadioValue = 'create';
    handleChangeAccountRadioGroup(e) {
        console.log('IM CHANGING ACCOUNT TO', e.target.value)
        this.accountRadioValue = e.target.value;
    }

    @query('#create-new-contact')
    createNewContactInput: UUIInputElement | undefined;
    @state()
    contactRadioValue = 'create';
    handleChangeContactRadioGroup(e) {
        console.log('IM CHANGING CONTACT TO', e.target.value)
        this.contactRadioValue = e.target.value;
    }

    @query('#create-new-deal')
    createNewDealInput: UUIInputElement | undefined;
    @state()
    dealRadioValue = 'create';
    handleChangeDealRadioGroup(e) {
        console.log('IM CHANGING DEAL TO', e.target.value)
        this.dealRadioValue = e.target.value;
    }

    @state()
    conversionFormError = false;
    
    async #handleConvert() {
        // RESET FORM
        if (this.createNewAccountInput) this.createNewAccountInput.error = false
        if (this.createNewContactInput) this.createNewContactInput.error = false 
        if (this.createNewDealInput) this.createNewDealInput.error = false
        this.conversionFormError = false;
            
        if (this.accountRadioValue === 'create' && this.createNewAccountInput && !this.createNewAccountInput.value) {
            this.createNewAccountInput.error = true;
            this.createNewAccountInput.errorMessage = 'Account Name cannot be empty';
        }

        if (this.contactRadioValue === 'create' && this.createNewContactInput && !this.createNewContactInput.value) {
            this.createNewContactInput.error = true;
            this.createNewContactInput.errorMessage = 'Contact Name cannot be empty';
        }

        if (this.dealRadioValue === 'create' && this.createNewDealInput && !this.createNewDealInput.value) {
            this.createNewDealInput.error = true;
            this.createNewDealInput.errorMessage = 'Deal Name cannot be empty';
        }
        
        if (this.createNewAccountInput?.error || this.createNewContactInput?.error || this.createNewDealInput?.error) {
            this.conversionFormError = true;
            setTimeout(() => {
                this.conversionFormError = false;
            }, 5000)
            return;
        }
        
        const payload: {
            accountToAttach?: number;
            dealToAttach?: number;
            contactToAttach?: number;
            accountToCreate?: string,
            dealToCreate?: string,
            contactToCreate?: string
        } = {};
        if (this.accountRadioValue === 'create') {
            payload.accountToCreate = this.createNewAccountInput?.value;
        } else {
            payload.accountToAttach = this.selectedAccount;
        }
        
        if (this.contactRadioValue === 'create') {
            payload.contactToCreate = this.createNewContactInput?.value;
        } else {
            payload.contactToAttach = this.selectedContact;
        }
        
        if (this.dealRadioValue === 'create') {
            payload.dealToCreate = this.createNewDealInput?.value;
        } else {
            payload.dealToAttach = this.selectedDeal;
        }
        
        this.converting = 'waiting';
        await this.data?._leadsService.convert(this.data?.leadToConvert as LeadModel, payload);
        this.converting = null;
        this.value = {converted: true};
        this.modalContext?.submit();
    }
    
    @state()
    converting: 'waiting' | null
    
    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Custom dialog'}>
                <div style="display: flex; flex-direction: column; gap: 2.5px; margin: -24px -24px 0 -24px;">
                    ${when(this.conversionFormError,
                            () => html`<p class="m-0" style="color: red; text-align: center">Fields Cannot be empty</p>`
                    )}
                    <div class="object-convert-options-container grid grid-cols-20-80">
                        <div>Account</div>
                        <uui-radio-group @change="${this.handleChangeAccountRadioGroup}" .value="${this.accountRadioValue}" class="object-convert-radio-option grid grid-cols-2" pristine="">
                            <uui-radio value="create">
                                <div @click="${(e) => {
                                    e.preventDefault();
                                    e.stopPropagation()
                                }}" class="flex flex-column gap-5">
                                    <label for="create-new-account">Create New</label>
                                    <uui-input @change="${(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation()
                                                }}"
                                               id="create-new-account" pristine=""
                                               label="Label"
                                               placeholder="Account Name" .value="${this.data?.leadToConvert.company}"></uui-input>
                                </div>
                            </uui-radio>
                            <uui-radio .disabled="${this.chooseExistingAccountReadonly}" value="new">
                                <div @click="${(e) => {
                                    e.preventDefault();
                                    e.stopPropagation()
                                }}" class="flex flex-column gap-5">
                                    <label for="create-new-deal">Choose Existing</label>
                                    <uui-select id="existingAccountOptions"
                                                .readonly="${this.chooseExistingAccountReadonly}"
                                                .placeholder="${this.existingAccountOptionsPlaceholder}"
                                                label="existingAccountOptions" name="existingAccountOptions"
                                                .options=${this.chooseExistingAccountOptions?.map(x => {
                                                    return {
                                                        name: x.label,
                                                        value: x.id.toString(),
                                                    }
                                                }) ?? [{
                                                    name: 'No Accounts found...',
                                                    value: null,
                                                    selected: true
                                                }]}></uui-select>
                                </div>
                            </uui-radio>
                        </uui-radio-group>
                    </div>
                    <div class="object-convert-options-container grid grid-cols-20-80">
                        <div>
                            Deal
                        </div>
                        <uui-radio-group  @change="${this.handleChangeDealRadioGroup}" .value="${this.dealRadioValue}"  class="object-convert-radio-option grid grid-cols-2" pristine="">
                            <uui-radio value="create">
                                <div @click="${(e) => {
                                    e.preventDefault();
                                    e.stopPropagation()
                                }}" class="flex flex-column gap-5">
                                    <label for="create-new-deal">Create New</label>
                                    <uui-input @change="${(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation()
                                                }}"
                                               id="create-new-deal" pristine=""
                                               label="Label"
                                               placeholder="Placeholder"></uui-input>
                                </div>
                            </uui-radio>
                            <uui-radio .disabled="${this.chooseExistingDealReadonly}" value="new">
                                <div @click="${(e) => {
                                    e.preventDefault();
                                    e.stopPropagation()
                                }}" class="flex flex-column gap-5">
                                    <label for="create-new-deal">Choose Existing</label>
                                    <uui-select id="existingDealOptions" label="existingDealOptions"
                                                .readonly="${this.chooseExistingDealReadonly}"
                                                name="existingDealOptions"
                                                .options=${this.chooseExistingDealOptions?.map(x => {
                                                    return {
                                                        name: x.label,
                                                        value: x.id.toString(),
                                                    }
                                                }) ?? [{
                                                    name: 'No Deal found...',
                                                    value: null,
                                                    selected: true
                                                }]}></uui-select>
                                </div>
                            </uui-radio>
                        </uui-radio-group>
                    </div>
                    <div class="flex" style="justify-content: flex-end" slot="actions">
                        <uui-button id="cancel" label="Cancel" @click="${this.#handleCancel}">Cancel</uui-button>
                        <uui-button id="convert" .state="${this.converting}" label="Convert" @click="${this.#handleConvert}">Convert</uui-button>
                    </div>
                </div>
            </umb-body-layout>
        `;
    }

}

export default ConvertLeadsModal;