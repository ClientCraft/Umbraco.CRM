// @ts-nocheck
import {UmbElementMixin} from "@umbraco-cms/backoffice/element-api";
import {LitElement, css, html, customElement, state, query, property} from "@umbraco-cms/backoffice/external/lit";
import {UUIInputEvent} from "@umbraco-ui/uui-input/lib";
import {CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN} from "../Context";
import UmbObjectAccountsWorkspaceContext from "../Context/object-accounts-workspace.context.ts";
import { AccountModel } from "../../../api/laravel-api-client";
import {UUIButtonElement} from "@umbraco-cms/backoffice/external/uui";

interface StoreAccountForm {
    account: AccountModel,
    state: "waiting" | null;
    setState: (state: 'waiting' | null) => void,
}

@customElement("create-object-accounts-workspace")
export class CreateOrEditObjectAccountsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _accountsContext?: UmbObjectAccountsWorkspaceContext;
    @query('#storeAccountReset')
    _storeAccountReset: UUIButtonElement | undefined;
    @property()
    backPath: string = '/umbraco/section/client-craft/workspace/accounts';
    constructor() {
        super();
        this.consumeContext(CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._accountsContext = _instance;
        });

        this._storeAccountForm = {
            account: {
                id: undefined,
                email: '',
                address: '',
                name: '',
                phone: '',
                industry: '',
                website: '',
                status: 'customer',
                updated_at: '',
                created_at: '',
            },
            state: null,
            setState: (state: null | "waiting") => {
                this._storeAccountForm = {...this._storeAccountForm, state};
            },
        };
    }

    isEditingAccount() {
        return this._accountsContext?.currentRoute?.params.id;
    }

    async connectedCallback() {
        super.connectedCallback();

        const params = new URLSearchParams(window.location.search);
        const backPathParam = params.get('backPath');
        if (backPathParam) {
            this.backPath = backPathParam;
        }

        // TODO: move this to the context route setup???
        if (!this._accountsContext?.currentRoute?.params.id) {
            // navigate out??
            return;
        }

        // Duplicated ID: 9876454  // This indicates the ID of the duplicated code. Search for this id in order to find places where code is duplicated
        const currentAccount = await this._accountsContext?.service.getAccount(
            this._accountsContext?.currentRoute?.params.id
        );

        this._storeAccountForm = {...this._storeAccountForm, ...currentAccount.data?.data};
    }

    // TODO: Maybe extract this to a method to handle forms?? Probably try to do something like Laravel Form Requests?
    private async _handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        e.stopPropagation();

        const i= e.target as HTMLFormElement;
        
        if(!i.checkValidity()) return;

        this._storeAccountForm.setState("waiting");

        const m = new FormData(i) as AccountModel;

        if (this.isEditingAccount() && this._storeAccountForm.account.id) {
            await this._accountsContext?.service.updateAccount(this._storeAccountForm.account.id.toString(), m);
        } else {
            await this._accountsContext?.service.createAccount(m);
            this._storeAccountReset?.click();
        }

        this._storeAccountForm.setState(null);
    }

    @state()
    private _storeAccountForm: StoreAccountForm;

    render() {
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.accounts.workspace.root"
                    back-path="${this.backPath}"
                    .enforceNoFooter=${true}
            >
                <div
                        slot="header"
                        style="width: 100%; display: flex; justify-content: space-between; align-items: center"
                >
                    <h3 id="headline">${this.localize.term("objects_accounts")}</h3>
                </div>
                <div class="p-20">
                    <uui-form>
                        <form id="storeAccountForm" name="storeAccountForm" @submit="${this._handleSubmit}">
                            <uui-box headline="Personal Information">
                                <div class="grid grid-cols-3">
                                    <uui-form-layout-item>
                                        <uui-label for="name" slot="label" required>Name</uui-label>
                                        <uui-input
                                                id="ame"
                                                name="name"
                                                type="text"
                                                label="Name"
                                                .value="${this._storeAccountForm.account.name || ""}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                                required
                                        ></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="email" slot="label" required>Email</uui-label>
                                        <uui-input
                                                id="email"
                                                name="email"
                                                type="email"
                                                label="Email"
                                                .value="${this._storeAccountForm.account.email || ""}"
                                                @change="${(e: UUIInputEvent) => console.log(e.target.value)}"
                                                required
                                        ></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="phone" slot="label" required>Phone</uui-label>
                                        <uui-input
                                                id="phone"
                                                name="phone"
                                                type="text"
                                                label="Phone"
                                                .value="${this._storeAccountForm.account.phone || ""}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                                required
                                        ></uui-input>
                                    </uui-form-layout-item>

                                    <!-- TODO: Change status, we need to fetch this from backend and use this to pass status id -->
                                    <uui-form-layout-item>
                                        <uui-label for="status" slot="label" required>Status</uui-label>
                                        <uui-select id="status" name="status" .options=${
                                                [
                                                    {
                                                        name: 'Customer',
                                                        value: 'customer',
                                                        selected: this._storeAccountForm.account.status === 'customer'
                                                    },
                                                    {
                                                        name: 'Churn',
                                                        value: 'churn',
                                                        selected: this._storeAccountForm.account.status === 'churn'
                                                    },
                                                
                                                ] as Array<{
                                                    name: string;
                                                    value: AccountModel['status'];
                                                    selected: boolean
                                                }>}></uui-select>
                                    </uui-form-layout-item>

                                    <!-- Industry -->
                                    <uui-form-layout-item>
                                        <uui-label for="industry" slot="label" required>Industry</uui-label>
                                        <uui-input
                                                id="industry"
                                                name="industry"
                                                type="text"
                                                label="Industry"
                                                .value="${this._storeAccountForm.account.industry || ""}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                                required
                                        ></uui-input>
                                    </uui-form-layout-item>

                                
                                    <!-- Website -->
                                    <uui-form-layout-item>
                                        <uui-label for="website" slot="label">Website</uui-label>
                                        <uui-input
                                                id="website"
                                                name="website"
                                                type="url"
                                                label="Website"
                                                .value="${this._storeAccountForm.account.website || ""}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                        ></uui-input>
                                    </uui-form-layout-item>
                                    <!-- More form items here -->
                                </div>
                            </uui-box>
                            <div style="display: flex; justify-content: end">
                                <uui-button id="storeLeadReset" type="reset" label="Reset" look="secondary">
                                    Reset
                                </uui-button>
                                <uui-button .state="${this._storeAccountForm.state}" type="submit" label="Submit"
                                            look="primary">
                                    Submit
                                </uui-button>
                            </div>
                        </form>
                    </uui-form>
                </div>
            </umb-workspace-editor>
        `;
    }

    static styles = [
        css`
            .p-20 {
                padding: 20px;
            }
            
            .grid {
                display: grid;
            }
            
            .grid-cols-3 {
                grid-template-columns: repeat(3, 1fr);
            }

            [id$="-label"] {
               font-weight: bold;
            }
            
            uui-box {
                margin-bottom: 10px;
            }
        `,
    ];
}

export default CreateOrEditObjectAccountsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        // @ts-ignore
        'create-object-accounts-workspace': CreateOrEditObjectAccountsWorkspaceElement
    }
}