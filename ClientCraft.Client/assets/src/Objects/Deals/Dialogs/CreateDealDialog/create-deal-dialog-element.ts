// @ts-nocheck
import {customElement, html, state} from "@umbraco-cms/backoffice/external/lit";
import {UmbModalBaseElement} from "@umbraco-cms/backoffice/modal";
import {CreateDealDialogValue, CreateDealDialogData} from "./create-deal-dialog-token.ts";

@customElement('create-deals-modal')
export class CreateDealsModal extends UmbModalBaseElement<CreateDealDialogData, CreateDealDialogValue> {
    @state()
    private _creatingDeal: boolean = false;

    @state()
    private _storeDealForm = {
        deal: {
            name: '',
            deal_status_id: undefined as number | undefined,
            amount: undefined as number | undefined,
            close_date: undefined as string | undefined,
            user_id: undefined as number | undefined,
            deal_type_id: undefined as number | undefined,
            priority: null as 'low' | 'medium' | 'high' | null,
        },
        state: null as null | 'waiting',
        setState: (state: null | 'waiting') => {
            this._storeDealForm = {...this._storeDealForm, state};
        },
    };

    @state()
    private _dealStatusOptions: Array<{ name: string, value: string }> = [];

    @state()
    private _userOptions: Array<{ name: string, value: string }> = [];

    @state()
    private _dealTypeOptions: Array<{ name: string, value: string }> = [];

    constructor() {
        super();
    }

    async connectedCallback() {
        super.connectedCallback();

        // Fetch options for dropdowns - adjust these based on your actual API
        const dealStatuses = await this.data?._dealsContext.dealStatus.getDealStatuses();
        this._dealStatusOptions = dealStatuses?.data?.map(status => ({
            name: status.label,
            value: status.id.toString()
        })) || [];

        const users = await this._dealsContext?.service.users.getUsers();
        this._userOptions = users?.data?.map(user => ({
            name: user.name,
            value: user.id.toString()
        })) || [];

        const dealTypes = await this._dealsContext?.service.deals.getDealTypes();
        this._dealTypeOptions = dealTypes?.data?.map(type => ({
            name: type.name,
            value: type.id.toString()
        })) || [];
    }

    async #handleCreate(e: SubmitEvent) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const form = e.target as HTMLFormElement;
        if (!form.checkValidity()) return;

        this._storeDealForm.setState('waiting');
        this.value = {created: true};

        const formData = new FormData(form);

        // Convert FormData to object matching your schema
        const dealData = {
            name: formData.get('name') as string,
            deal_status_id: formData.get('deal_status_id') ? Number(formData.get('deal_status_id')) : undefined,
            amount: formData.get('amount') ? Number(formData.get('amount')) : undefined,
            close_date: formData.get('close_date') as string | undefined,
            user_id: formData.get('user_id') ? Number(formData.get('user_id')) : undefined,
            deal_type_id: formData.get('deal_type_id') ? Number(formData.get('deal_type_id')) : undefined,
            priority: formData.get('priority') as 'low' | 'medium' | 'high' | null,
        };

        try {
            const createResult = await this.data?._dealsContext.deals.createDeal(dealData);
            console.log(createResult);
            this.modalContext?.submit();
        } catch (error) {
            console.error('Failed to create deal:', error);
        } finally {
            this._storeDealForm.setState(null);
            this._creatingDeal = false;
        }
    }

    #handleClose() {
        this.value = {created: false};
        this.modalContext?.submit();
    }

    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Create Deal'}>
                <uui-form>
                    <form @submit="${this.#handleCreate}">
                        <uui-box headline="Deal Information">
                            <div class="grid grid-cols-2 gap-4">
                                <uui-form-layout-item>
                                    <uui-label for="name" required>Name</uui-label>
                                    <uui-input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                    ></uui-input>
                                </uui-form-layout-item>

                                <uui-form-layout-item>
                                    <uui-label for="amount">Amount</uui-label>
                                    <uui-input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            min="0"
                                    ></uui-input>
                                </uui-form-layout-item>

                                <uui-form-layout-item>
                                    <uui-label for="close_date">Close Date</uui-label>
                                    <uui-input
                                            id="close_date"
                                            name="close_date"
                                            type="date"
                                    ></uui-input>
                                </uui-form-layout-item>

                                <uui-form-layout-item>
                                    <uui-label for="priority">Priority</uui-label>
                                    <uui-select
                                            id="priority"
                                            name="priority"
                                            .options=${[
                                                {name: 'Select priority', value: null},
                                                {name: 'Low', value: 'low'},
                                                {name: 'Medium', value: 'medium'},
                                                {name: 'High', value: 'high'}
                                            ]}
                                    ></uui-select>
                                </uui-form-layout-item>

                                <uui-form-layout-item>
                                    <uui-label for="deal_status_id">Deal Status</uui-label>
                                    <uui-select
                                            id="deal_status_id"
                                            name="deal_status_id"
                                            .options=${[{name: 'Select status', value: null}, ...this._dealStatusOptions]}
                                    ></uui-select>
                                </uui-form-layout-item>

                                <uui-form-layout-item>
                                    <uui-label for="user_id">User</uui-label>
                                    <uui-select
                                            id="user_id"
                                            name="user_id"
                                            .options=${[{name: 'Select user', value: ''}, ...this._userOptions]}
                                    ></uui-select>
                                </uui-form-layout-item>

                                <uui-form-layout-item>
                                    <uui-label for="deal_type_id">Deal Type</uui-label>
                                    <uui-select
                                            id="deal_type_id"
                                            name="deal_type_id"
                                            .options=${[{name: 'Select type', value: ''}, ...this._dealTypeOptions]}
                                    ></uui-select>
                                </uui-form-layout-item>
                            </div>
                        </uui-box>

                        <div slot="actions" class="mt-4 flex justify-end gap-2">
                            <uui-button
                                    label="Close"
                                    @click="${this.#handleClose}"
                            >Close
                            </uui-button>
                            <uui-button
                                    type="submit"
                                    color='positive'
                                    look="primary"
                                    label="Create"
                                    .state="${this._creatingDeal ? 'waiting' : null}"
                            >Create
                            </uui-button>
                        </div>
                    </form>
                </uui-form>
            </umb-body-layout>
        `;
    }
}

export default CreateDealsModal;