// @ts-nocheck
import { UmbElementMixin }
    from "@umbraco-cms/backoffice/element-api";
import { LitElement, css, html, customElement, state, query, property }
    from "@umbraco-cms/backoffice/external/lit";
import {UUIInputEvent} from "@umbraco-ui/uui-input/lib"
import { CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN } from "../Context";
import UmbObjectContactsWorkspaceContext from "../Context/object-contacts-workspace.context.ts";
import { ContactModel } from "../../../api/laravel-api-client";
import {UUIButtonElement} from "@umbraco-cms/backoffice/external/uui";

interface StoreContactForm {
    contact: ContactModel,
    state: "waiting" | null;
    setState: (state: 'waiting' | null) => void,
}

@customElement('create-object-contacts-workspace')
export class CreateOrEditObjectContactsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _contactsContext?: UmbObjectContactsWorkspaceContext
    @query('#storeContactReset')
    _storeContactReset: UUIButtonElement | undefined;
    @property()
    backPath: string = '/umbraco/section/client-craft/workspace/contacts';
    constructor() {
        super();
        this.consumeContext(CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._contactsContext = _instance;
        });
        
        this._storeContactForm = {
            contact: {
                id: undefined,
                address: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                updated_at: '',
                created_at: ''
            },
            state: null,
            setState: (state: null | 'waiting') => {
                this._storeContactForm = {...this._storeContactForm, state};
            },
        };
    }
    
    isEditingContact() {
        return this._contactsContext?.currentRoute?.params.id;
    }
    
    async connectedCallback() {
        super.connectedCallback();

        const params = new URLSearchParams(window.location.search);
        const backPathParam = params.get('backPath');
        if (backPathParam) {
            this.backPath = backPathParam;
        }
        
        // TODO: move this to the context route setup???
        if (!this._contactsContext?.currentRoute?.params.id) {
            // navigate out??
            return;
        }

        // Duplicated ID: 3547951 // This indicates the ID of the duplicated code. Search for this id in order to find places where code is duplicated
        // TODO: abstract that out of here??? Maybe a getter (we have repeated logic for this)
        const currentContact = await this._contactsContext?.service.getContact(
            this._contactsContext?.currentRoute?.params.id
        );

        this._storeContactForm = { ...this._storeContactForm, ...currentContact.data?.data };
    }
    
    // TODO: Maybe extract this to a method to handle forms?? Probably try to do something like Laravel Form Requests?
    private async _handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        e.stopPropagation();

        const i= e.target as HTMLFormElement;

        if(!i.checkValidity()) return;

        this._storeContactForm.setState("waiting");

        const m = new FormData(i) as ContactModel;

        if (this.isEditingContact() && this._storeContactForm.contact.id) {
            await this._contactsContext?.service.updateContact(this._storeContactForm.contact.id.toString(), m)
        } else {
            await this._contactsContext?.service.createContact(m);
            this._storeContactReset?.click();
        }

        console.log(this._storeContactForm.setState);
        this._storeContactForm.setState(null);
    }
    
    @state()
    private _storeContactForm: StoreContactForm;

    render() {
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.contacts.workspace.root"
                    back-path="${this.backPath}"
                    .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_contacts')}</h3>
                </div>
                <div class="p-20">
                    <uui-form>
                        <form id="storeContactForm" name="storeContactForm" @submit="${this._handleSubmit}">
                            <uui-box headline="Personal Information">
                                <div class="grid grid-cols-3">
                                    <uui-form-layout-item>
                                        <uui-label for="firstName" slot="label" required>Name</uui-label>
                                        <uui-input
                                                id="firstName"
                                                name="first_name"
                                                type="text"
                                                label="First Name"
                                                .value="${this._storeContactForm.contact.first_name || ''}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                                required></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="lastName" slot="label" required>Last Name</uui-label>
                                        <uui-input
                                                id="lastName"
                                                name="last_name"
                                                type="text"
                                                label="Last Name"
                                                .value="${this._storeContactForm.contact.last_name || ''}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                                required></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="email" slot="label" required>Email</uui-label>
                                        <uui-input
                                                id="email"
                                                name="email"
                                                type="email"
                                                label="Email"
                                                .value="${this._storeContactForm.contact.email || ''}"
                                                @change="${(e: UUIInputEvent) => console.log(e.target.value)}"
                                                required></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="phone" slot="label" required>Phone</uui-label>
                                        <uui-input
                                                id="phone"
                                                name="phone"
                                                type="text"
                                                label="Phone"
                                                .value="${this._storeContactForm.contact.phone || ''}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                                required></uui-input>
                                    </uui-form-layout-item>

                                    <!-- Address -->
                                    <uui-form-layout-item>
                                        <uui-label for="address" slot="label" required>Address</uui-label>
                                        <uui-input
                                                id="address"
                                                name="address"
                                                type="text"
                                                label="Address"
                                                .value="${this._storeContactForm.contact.address || ""}"
                                                @change="${(e: UUIInputEvent) => console.log(e)}"
                                                required
                                        ></uui-input>
                                    </uui-form-layout-item>


                                </div>
                            </uui-box>
                            <div style="display: flex; justify-content: end">
                                <uui-button type="reset" label="Reset" look="secondary">
                                    Reset
                                </uui-button>
                                <uui-button .state="${this._storeContactForm.state}" type="submit" label="Submit"
                                            look="primary">
                                    Submit
                                </uui-button>
                            </div>
                        </form>
                    </uui-form>

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
        // @ts-ignore
        'create-object-contacts-workspace': CreateOrEditObjectContactsWorkspaceElement
    }
}