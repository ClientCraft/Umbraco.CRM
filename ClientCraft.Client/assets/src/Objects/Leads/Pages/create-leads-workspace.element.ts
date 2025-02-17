// @ts-nocheck
import {UmbElementMixin}
    from "@umbraco-cms/backoffice/element-api";
import {LitElement, css, html, customElement, state, query, property}
    from "@umbraco-cms/backoffice/external/lit";
import {UUIInputEvent} from "@umbraco-ui/uui-input/lib"
import {CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN} from "../Context";
import UmbObjectLeadsWorkspaceContext from "../Context/object-leads-workspace.context.ts";
import {LeadModel} from "../../../api/laravel-api-client";
import {UUIButtonElement, UUISelectEvent} from "@umbraco-cms/backoffice/external/uui";
import {LeadStatusColors, LeadStatuses} from "./root-leads-workspace.element.ts";

interface StoreLeadForm {
    lead: LeadModel,
    state: "waiting" | null;
    setState: (state: 'waiting' | null) => void,
}

@customElement('create-object-leads-workspace')
export class CreateOrEditObjectLeadsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _leadsContext?: UmbObjectLeadsWorkspaceContext
    @query('#storeLeadReset')
    _storeLeadReset: UUIButtonElement | undefined;
    @property()
    backPath: string = '/umbraco/section/client-craft/workspace/leads';
    @state()
    _leadStatusOptions: Array<Option> = [];

    constructor() {
        super();
        this.consumeContext(CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._leadsContext = _instance;
        });

        this._storeLeadForm = {
            lead: {},
            state: null,
            setState: (state: null | 'waiting') => {
                this._storeLeadForm = {...this._storeLeadForm, state};
            }
        };
    }

    isEditingLead() {
        return this._leadsContext?.currentRoute?.params.id;
    }

    async connectedCallback() {
        super.connectedCallback();

        const params = new URLSearchParams(window.location.search);
        const backPathParam = params.get('backPath');
        if (backPathParam) {
            this.backPath = backPathParam;
        }

        const leadStatuses = await this._leadsContext?.service.leads.getLeadStatuses();
        if (Array.isArray(leadStatuses) && leadStatuses.every(item => this.isLeadStatuses(item))) {
            this._leadStatusOptions = leadStatuses.map(x => {
                return {
                    name: x.label,
                    value: x.id.toString()
                }
            }) as Array<Option>;
        } else {
            console.error("leadStatuses is not a valid array of LeadStatus objects.");
        }

        // TODO: move this to the context route setup???
        if (!this._leadsContext?.currentRoute?.params.id) {
            // navigate out??
            return;
        }

        // Duplicated ID: 154876 // This indicates the ID of the duplicated code. Search for this id in order to find places where code is duplicated
        // TODO: abstract that out of here??? Maybe a getter (we have repeated logic for this)
        const currentLead = await this._leadsContext?.service.leads.getLead(
            this._leadsContext?.currentRoute?.params.id
        );

        this._storeLeadForm = {...this._storeLeadForm, ...{lead: currentLead.data?.data}};
    }

    public isLeadStatuses(item: any): item is LeadStatuses {
        return (
            typeof item === 'object' &&
            item !== null &&
            typeof item.id === 'number' &&
            typeof item.label === 'string' &&
            LeadStatusColors.includes(item.color)
        );
    }

    // TODO: Maybe extract this to a method to handle forms?? Probably try to do something like Laravel Form Requests?
    private async _handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        e.stopPropagation();

        const i = e.target as HTMLFormElement;

        if (!i.checkValidity()) return;

        this._storeLeadForm.setState("waiting");

        const m = new FormData(i) as LeadModel;

        if (this.isEditingLead() && this._storeLeadForm.lead.id) {
            await this._leadsContext?.service.leads.updateLead(this._storeLeadForm.lead.id.toString(), m)
        } else {
            await this._leadsContext?.service.leads.createLead(m);

            // Navigate to created lead
            console.log(this._storeLeadForm.lead);
        }

        this._storeLeadForm.setState(null);
    }

    @state()
    private _storeLeadForm: StoreLeadForm;

    render() {
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.leads.workspace.root"
                    back-path="${this.backPath}"
                    .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_leads')}</h3>
                </div>
                <div class="p-20">
                    <uui-form>
                        <form id="storeLeadForm" name="storeLeadForm" @submit="${this._handleSubmit}">
                            <uui-box headline="Personal Information">
                                <div class="grid grid-cols-3">
                                    <uui-form-layout-item>
                                        <uui-label for="name" slot="label" required>Name</uui-label>
                                        <uui-input
                                                id="name"
                                                name="name"
                                                type="text"
                                                label="Name"
                                                value="${this._storeLeadForm.lead.name}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.name = e.target.value}"
                                                required></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="email" slot="label" required>Email</uui-label>
                                        <uui-input
                                                id="email"
                                                name="email"
                                                type="email"
                                                label="Email"
                                                value="${this._storeLeadForm.lead.email || ''}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.email = e.target.value}"
                                                required></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="phone" slot="label" required>Phone</uui-label>
                                        <uui-input
                                                id="phone"
                                                name="phone"
                                                type="text"
                                                label="Phone"
                                                value="${this._storeLeadForm.lead.phone || ''}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.phone = e.target.value}"
                                                required></uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="role" slot="label">Role</uui-label>
                                        <uui-input
                                                id="role"
                                                name="role"
                                                type="text"
                                                label="Role"
                                                value="${this._storeLeadForm.lead.role || ''}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.role = e.target.value}">
                                        </uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="linkedin" slot="label">Linkedin</uui-label>
                                        <uui-input
                                                id="linkedin"
                                                name="linkedin_url"
                                                type="text"
                                                label="Linkedin"
                                                value="${this._storeLeadForm.lead.linkedin_url || ''}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.linkedin_url = e.target.value}">
                                        </uui-input>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="facebook" slot="label">Facebook</uui-label>
                                        <uui-input
                                                id="facebook"
                                                name="facebook_url"
                                                type="text"
                                                label="Facebook"
                                                value="${this._storeLeadForm.lead.facebook_url || ''}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.facebook_url = e.target.value}">
                                        </uui-input>
                                    </uui-form-layout-item>
                                    
                                    <uui-form-layout-item>
                                        <uui-label for="instagram" slot="label">Instagram</uui-label>
                                        <uui-input
                                                id="instagram"
                                                name="instagram_url"
                                                type="text"
                                                label="Instagram"
                                                value="${this._storeLeadForm.lead.instagram_url || ''}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.instagram_url = e.target.value}">
                                        </uui-input>
                                    </uui-form-layout-item>

                                    <!-- TODO: Change status, we need to fetch this from backend and use this to pass status id -->
                                    <uui-form-layout-item>
                                        <uui-label for="lead_status_id" slot="label" required>Status</uui-label>
                                        <uui-select id="lead_status_id"
                                                    label="Lead Status"
                                                    name="lead_status_id"
                                                    placeholder="Select a status"
                                                    .options=${this._leadStatusOptions}
                                        >
                                        </uui-select>
                                    </uui-form-layout-item>

                                    <uui-form-layout-item>
                                        <uui-label for="company" slot="label" required>Company</uui-label>
                                        <uui-input
                                                id="company"
                                                name="company"
                                                type="text"
                                                label="Company"
                                                value="${this._storeLeadForm.lead.company}"
                                                @change="${(e: UUIInputEvent) => this._storeLeadForm.lead.company = e.target.value}"
                                                required>
                                        </uui-input>
                                    </uui-form-layout-item>
                                </div>
                            </uui-box>

                            <div style="display: flex; justify-content: end">
                                <uui-button id="storeLeadReset" type="reset" label="Reset" look="secondary">
                                    Reset
                                </uui-button>
                                <uui-button .state="${this._storeLeadForm.state}" type="submit" label="Submit"
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

        [ id $= "-label" ] {
            font-weight: bold;
        }

            uui-box {
                margin-bottom: 10px;
            }
        `,
    ];

}

export default CreateOrEditObjectLeadsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        // @ts-ignore
        'create-object-leads-workspace': CreateOrEditObjectLeadsWorkspaceElement
    }
}