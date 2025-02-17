﻿// @ts-nocheck
import { UmbElementMixin }
    from "@umbraco-cms/backoffice/element-api";
import { LitElement, css, html, customElement, state }
    from "@umbraco-cms/backoffice/external/lit";
import {CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN} from "../Context";
import UmbObjectContactsWorkspaceContext from "../Context/object-contacts-workspace.context";
import {ContactModel} from "../../../api/laravel-api-client";

@customElement('view-object-contacts-workspace')
export class CreateOrEditObjectContactsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _contactsContext?: UmbObjectContactsWorkspaceContext

    @state()
    private _contact?: ContactModel;
    
    constructor() {
        super();
        this.consumeContext(CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._contactsContext = _instance;
        });
    }
    
    async connectedCallback() {
        super.connectedCallback();
        console.log('CONNECTED');

        // TODO: move this to the context route setup???
        if (!this._contactsContext?.currentRoute?.params.id) {
            // navigate out??
            return;
        }

        // Duplicated ID: 3547951  // This indicates the ID of the duplicated code. Search for this id in order to find places where code is duplicated
        // TODO: abstract that out of here??? Maybe a getter (we have repeated logic for this)
        const currentContact = await this._contactsContext?.service.getContact(
            this._contactsContext?.currentRoute?.params.id
        );
        
        this._contact = currentContact.data?.data;
    }

    render() {
        return html`
            <umb-workspace-editor 
                alias="ClientCraft.contacts.workspace.root"
                back-path="/umbraco/section/client-craft/workspace/contacts"
                .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_contacts')}</h3>
                    <!-- TODO: try to find a better approach for route creation -->
                    <!-- TODO: improve this? ... params id shouldnt be empty but should we check this edge case? -->
                    <uui-button pristine="" href="/umbraco/section/client-craft/workspace/contacts/edit/${this._contactsContext?.currentRoute?.params?.id}" label="Edit"
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
                                  ${this._contact?.name}
                                </p>
                            </span>
                            <span>
                                <span id="email-label">Email</span>
                                <p aria-labelledby="email-label">
                                    ${this._contact?.email}
                                </p>
                            </span>
                            <span>
                                <span id="account-name-label">Account Name</span>
                                <p aria-labelledby="account-name-label">
                                  ${this._contact?.account_name}
                                </p>
                            </span>
                            <span>
                                <span id="last-name-label">Last Name</span>
                                <p aria-labelledby="last-name-label">
                                  ${this._contact?.last_name}
                                </p>
                            </span>
                            <span>
                                <span id="phone-label">Phone</span>
                                <p aria-labelledby="phone-label">
                                  ${this._contact?.phone}
                                </p>
                            </span>
                            <span>
                                <span id="assigned-user-label">Assigned User</span>
                                <p aria-labelledby="assigned-user-label">
                                  ${this._contact?.assigned_user}
                                </p>
                            </span>
                            <span>
                                <span id="title-label">Title</span>
                                <p aria-labelledby="title-label">
                                  ${this._contact?.title}
                                </p>
                            </span>
                            <span>
                                <span id="website-label">Website</span>
                                <p aria-labelledby="website-label">
                                  ${this._contact?.website}
                                </p>
                            </span>
                        </div>
                    </uui-box>

                    <uui-box headline="Location">
                        <div class="grid grid-cols-3">
                            <span>
                                <span id="address-label">Address</span>
                                <p aria-labelledby="address-label">
                                    ${this._contact?.address_road}
                                </p>
                            </span>
                            <span>
                                <span id="country-label">Country</span>
                                <p aria-labelledby="country-label">
                                    ${this._contact?.address_country}
                                </p>
                            </span>
                            <span>
                                <span id="opp-amount-label">Opportunity Amount</span>
                                <p aria-labelledby="opp-amount-label">
                                    ${this._contact?.opportunyty_amount}
                                </p>
                            </span>
                            <span>
                                <span id="city-label">City</span>
                                <p aria-labelledby="city-label">
                                    ${this._contact?.address_city}
                                </p> 
                            </span>
                            <span>
                                <span id="source-label">Source</span>
                                <p aria-labelledby="souce-label">
                                    ${this._contact?.source}
                                </p>
                            </span>
                            <span>
                                <span id="postal-code-label">Postal Code</span>
                                <p aria-labelledby="postal-code-label">
                                    ${this._contact?.postal_code}
                                </p>
                            </span>
                        </div>
                    </uui-box>

                    <uui-box>
                        <div class="grid grid-cols-3">
                            <span style="grid-row: span 2">
                                <span id="photo-label" style="display: block;">Photo</span>
                                <img aria-labelledby="photo-label" src="${this._contact?.photo}"/>
                            </span>
                            <span>
                                <span id="status-label">Status</span>
                                <p aria-labelledby="status-label">
                                    ${this._contact?.status}
                                </p>
                            </span>
                            <span>
                                <span id="industry-label">Industry</span>
                                <p aria-labelledby="industry-label">
                                    ${this._contact?.industry}
                                </p>
                            </span>
                        </div>
                    </uui-box>

                    <uui-box>
                        <div class="grid grid-cols-3">
                            <span style="grid-column: span 3">
                                <span id="description-label">Description</span>
                                <p aria-labelledby="description-label">
                                    ${this._contact?.description}
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

export default CreateOrEditObjectContactsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        'view-object-contacts-workspace': CreateOrEditObjectContactsWorkspaceElement
    }
}