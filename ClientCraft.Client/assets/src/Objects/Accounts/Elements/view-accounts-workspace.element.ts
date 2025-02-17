// @ts-nocheck
import { UmbElementMixin }
    from "@umbraco-cms/backoffice/element-api";
import { LitElement, css, html, customElement, state }
    from "@umbraco-cms/backoffice/external/lit";
import UmbObjectAccountsWorkspaceContext from "../Context/object-accounts-workspace.context.ts";
import {CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN} from "../Context";

@customElement('view-object-accounts-workspace')
export class CreateOrEditObjectAccountsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _accountsContext?: UmbObjectAccountsWorkspaceContext

    @state()
    private _account?: unknown;
    
    constructor() {
        super();
        this.consumeContext(CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._accountsContext = _instance;
        });
    }
    
    async connectedCallback() {
        super.connectedCallback();
        console.log('CONNECTED');

        // TODO: move this to the context route setup???
        if (!this._accountsContext?.currentRoute?.params.id) {
            // navigate out??
            return;
        }

        // Duplicated ID: 9876454
        // TODO: abstract that out of here??? Maybe a getter (we have repeated logic for this)
        const currentAccount = await this._accountsContext?.service.getAccount(
            this._accountsContext?.currentRoute?.params.id
        );
        
        this._account = currentAccount.data?.data;
    }

    render() {
        return html`
            <umb-workspace-editor 
                alias="ClientCraft.accounts.workspace.root"
                back-path="/umbraco/section/client-craft/workspace/accounts"
                .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_accounts')}</h3>
                    <!-- TODO: try to find a better approach for route creation -->
                    <!-- TODO: improve this? ... params id shouldnt be empty but should we check this edge case? -->
                    <uui-button pristine="" href="/umbraco/section/client-craft/workspace/accounts/edit/${this._accountsContext?.currentRoute?.params?.id}" label="Edit"
                                look="primary" style="--uui-button-height: min-content">
                        <uui-icon name="edit"></uui-icon>
                        Edit
                    </uui-button>
                </div>
                <div class="p-20">
                    <uui-box headline="Personal Information">
                        <div class="grid grid-cols-3">
                            <span>
                                <span id="first-name-label">First Name</span>
                                <p aria-labelledby="first-name-label">
                                  ${this._account?.name}
                                </p>
                            </span>
                            <span>
                                <span id="email-label">Email</span>
                                <p aria-labelledby="email-label">
                                    ${this._account?.email}
                                </p>
                            </span>
                            <span>
                                <span id="account-name-label">Account Name</span>
                                <p aria-labelledby="account-name-label">
                                  ${this._account?.account_name}
                                </p>
                            </span>
                            <span>
                                <span id="last-name-label">Last Name</span>
                                <p aria-labelledby="last-name-label">
                                  ${this._account?.last_name}
                                </p>
                            </span>
                            <span>
                                <span id="phone-label">Phone</span>
                                <p aria-labelledby="phone-label">
                                  ${this._account?.phone}
                                </p>
                            </span>
                            <span>
                                <span id="assigned-user-label">Assigned User</span>
                                <p aria-labelledby="assigned-user-label">
                                  ${this._account?.assigned_user}
                                </p>
                            </span>
                            <span>
                                <span id="title-label">Title</span>
                                <p aria-labelledby="title-label">
                                  ${this._account?.title}
                                </p>
                            </span>
                            <span>
                                <span id="website-label">Website</span>
                                <p aria-labelledby="website-label">
                                  ${this._account?.website}
                                </p>
                            </span>
                        </div>
                    </uui-box>

                    <uui-box headline="Location">
                        <div class="grid grid-cols-3">
                            <span>
                                <span id="address-label">Address</span>
                                <p aria-labelledby="address-label">
                                    ${this._account?.address_road}
                                </p>
                            </span>
                            <span>
                                <span id="country-label">Country</span>
                                <p aria-labelledby="country-label">
                                    ${this._account?.address_country}
                                </p>
                            </span>
                            <span>
                                <span id="opp-amount-label">Opportunity Amount</span>
                                <p aria-labelledby="opp-amount-label">
                                    ${this._account?.opportunyty_amount}
                                </p>
                            </span>
                            <span>
                                <span id="city-label">City</span>
                                <p aria-labelledby="city-label">
                                    ${this._account?.address_city}
                                </p> 
                            </span>
                            <span>
                                <span id="source-label">Source</span>
                                <p aria-labelledby="souce-label">
                                    ${this._account?.source}
                                </p>
                            </span>
                            <span>
                                <span id="postal-code-label">Postal Code</span>
                                <p aria-labelledby="postal-code-label">
                                    ${this._account?.postal_code}
                                </p>
                            </span>
                        </div>
                    </uui-box>

                    <uui-box>
                        <div class="grid grid-cols-3">
                            <span style="grid-row: span 2">
                                <span id="photo-label" style="display: block;">Photo</span>
                                <img aria-labelledby="photo-label" src="${this._account?.photo}"/>
                            </span>
                            <span>
                                <span id="status-label">Status</span>
                                <p aria-labelledby="status-label">
                                    ${this._account?.status}
                                </p>
                            </span>
                            <span>
                                <span id="industry-label">Industry</span>
                                <p aria-labelledby="industry-label">
                                    ${this._account?.industry}
                                </p>
                            </span>
                        </div>
                    </uui-box>

                    <uui-box>
                        <div class="grid grid-cols-3">
                            <span style="grid-column: span 3">
                                <span id="description-label">Description</span>
                                <p aria-labelledby="description-label">
                                    ${this._account?.description}
                                </p>
                            </span>
                        </div>
                    </uui-box>
                </div>
            </umb-workspace-editor>
        `
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
        'view-object-accounts-workspace': CreateOrEditObjectAccountsWorkspaceElement
    }
}