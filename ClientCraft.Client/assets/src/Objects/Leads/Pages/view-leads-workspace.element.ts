// @ts-nocheck
import { UmbElementMixin }
    from "@umbraco-cms/backoffice/element-api";
import { LitElement, css, html, customElement, state, property, repeat, when }
    from "@umbraco-cms/backoffice/external/lit";
import {UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext} from "@umbraco-cms/backoffice/modal";
import {CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN} from "../Context";
import UmbObjectLeadsWorkspaceContext from "../Context/object-leads-workspace.context.ts";
import {LeadModel} from "../../../api/laravel-api-client";
import { choose } from "lit/directives/choose.js";
import {LeadStatusColors, LeadStatuses} from "./root-leads-workspace.element.ts";
import {BaseException} from "../../../Exceptions/BaseException/base.exception.ts";
import { CONVERT_LEAD_MODAL } from "../Dialogs/ConvertLeadDialog/convert-lead-dialog-token.ts";
@customElement('view-object-leads-workspace')
export class CreateOrEditObjectLeadsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _leadsContext?: UmbObjectLeadsWorkspaceContext
    private _modalContext?: UmbModalManagerContext

    @state()
    private _lead?: LeadModel;
    @property()
    backPath: string = '/umbraco/section/client-craft/workspace/leads';
    @state()
    _leadStatusOptions: LeadStatuses[] = [];
    
    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            this._modalContext = _instance;
        });
        this.consumeContext(CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._leadsContext = _instance;
        });
      
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
            this._leadStatusOptions = leadStatuses;
        } else {
            console.error("leadStatuses is not a valid array of LeadStatus objects.");
        }
        
        // TODO: move this to the context route setup???
        if (!this._leadsContext?.currentRoute?.params.id) {
            // navigate out??
            return;
        }

        // Duplicated ID: 154876
        // TODO: abstract that out of here??? Maybe a getter (we have repeated logic for this)
        const currentLead = await this._leadsContext?.service.leads.getLead(
            this._leadsContext?.currentRoute?.params.id
        );
        this._lead = currentLead.data?.data;
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
    @state()
    public selectedTab = 'emails';

    #onTabChange(e: PointerEvent) {
        this.selectedTab = (e.target as HTMLElement).getAttribute('data-tab') as string;
    }

    async openConvertModal() {
        const customContext = this._modalContext?.open(this, CONVERT_LEAD_MODAL, {
            data: {
                headline: 'Convert Lead',
                _leadsService: this._leadsContext?.service.leads,
                _contactsService: this._leadsContext?.service.contacts,
                _accountsService: this._leadsContext?.service.accounts,
                _dealsService: this._leadsContext?.service.deals,
                leadToConvert: this._lead
            }
        });

        const data = await customContext?.onSubmit();
        
        // this._leadsContext?.service.leads.convert(this._lead as LeadModel, data)
    }

    renderEmailTabContent() {
        return html`
            <div style="display: flex; flex-direction: column; gap: 10px">
                <div style="display: flex; justify-content: space-between"
                ">
                <span>dropdown</span>
                <span>button</span>
            </div>
            <uui-box>
                <div slot="header" class="flex" style="justify-content: space-between; width: 100%">
                    <div class="flex">
                        <uui-symbol-expand open="${false}" style="margin-right: 5px"></uui-symbol-expand>
                        <h4 class="m-0">Email Subject</h4>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="lucide lucide-calendar-clock">
                            <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/>
                            <path d="M16 2v4"/>
                            <path d="M8 2v4"/>
                            <path d="M3 10h5"/>
                            <path d="M17.5 17.5 16 16.3V14"/>
                            <circle cx="16" cy="16" r="6"/>
                        </svg>
                        Today, 12:00 PM
                    </div>
                </div>
                <div class="flex" style="flex-direction: column; gap: 10px; padding: 10px">
                    ${repeat([1, 2, 3, 4], (index: number) => html` <uui-box>
                        <div slot="header" class="flex" style="justify-content: space-between; width: 100%">
                            <div class="flex" style="gap: 10px;">
                                <uui-avatar style="font-size: 20px;" name="Sending user"></uui-avatar>
                                <div>
                                    <h5 class="m-0">Sending User Name</h5>
                                    <p class="m-0">To: Jerome Bell</p>
                                </div>
                            </div>
                            <div class="flex" style="align-items: center; gap: 5px">
                                10 Jun 2025 at 12:00 PM
                                <hr style="width: 1px; height: 20px; display: inline-block; vertical-align: middle; border-left: none; border-right: 1px solid black;"/>
                                <div style="height: 16px; width: 16px; border: 1px solid black; border-radius: 50px; display: flex; align-items: center; justify-content: center;"
                                     title="reply">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="lucide lucide-reply">
                                        <polyline points="9 17 4 12 9 7"/>
                                        <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                                    </svg>
                                </div>
                                <div style="height: 16px; width: 16px; border: 1px solid black; border-radius: 50px; display: flex; align-items: center; justify-content: center;"
                                     title="forward">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="lucide lucide-forward">
                                        <polyline points="15 17 20 12 15 7"/>
                                        <path d="M4 18v-2a4 4 0 0 1 4-4h12"/>
                                    </svg>
                                </div>
                                <div style="height: 16px; width: 16px; border: 1px solid black; border-radius: 50px; display: flex; align-items: center; justify-content: center;"
                                     title="delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="lucide lucide-trash-2">
                                        <path d="M3 6h18"/>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        <line x1="10" x2="10" y1="11" y2="17"/>
                                        <line x1="14" x2="14" y1="11" y2="17"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div style="padding: 18px">
                            <p class="m-0">
                                Email thread text
                            </p>
                        </div>
                    </uui-box>`)}
                </div>
            </uui-box>
            </div>
        `;
    }

    public async _changeLeadStage(e: CustomEvent) {
        // TODO: change the lead statuses
        if (!this._lead) {
            return;
        }

        const selectedStatus = e.detail.stage;
        this._lead.lead_status_id = selectedStatus.id;
        this._lead.status = selectedStatus;

        if (this._lead?.id) {
            const result = await this._leadsContext?.service.leads.updateLead(this._lead.id.toString(), this._lead);

            // @ts-ignore
            if (BaseException.IsAxiosError(result?.data?.name)) {
                console.log(result);
                return;
            }

            this._lead = {...this._lead, status: selectedStatus};
        }
    }
    
    renderCallsTabContent() {
        return html``;
    }
    
    renderTasksTabContent() {
        return html``;
    }
    
    renderMeetingsTabContent() {
        return html``;
    }
    
    render() {
        // @ts-ignore
        // @ts-ignore
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.leads.workspace.root"
                    back-path="${this.backPath}"
                    .enforceNoFooter=${true}>

                <!-- Workspace header -->
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_leads')}</h3>
                    <span>
                        <!-- TODO: Need to implement a dynamic logic that disables this button if the lead is not ready to convert -->
                        ${
                                when(
                                        // TODO: we cannot have something hardcoded, find a better way later
                                        this._lead?.status?.label === "Qualified",
                                        () => html`<uui-button @click="${() => this.openConvertModal()}" pristine="" label="Edit"
                                                               look="primary" style="--uui-button-height: min-content">
                                            Convert to Contact
                                        </uui-button>`
                                )
                        }
                        <!-- TODO: try to find a better approach for route creation -->
                        <!-- TODO: improve this? ... params id shouldnt be empty but should we check this edge case? -->
                        <uui-button pristine=""
                                    href="/umbraco/section/client-craft/workspace/leads/edit/${this._leadsContext?.currentRoute?.params?.id}?backPath=${window.location.pathname + window.location.search}"
                                    label="Edit"
                                    look="primary" style="--uui-button-height: min-content">
                            <uui-icon name="edit"></uui-icon>
                            Edit
                        </uui-button>
                    </span>
                </div>

                <!-- Lead info banner -->
                <div class="p-15 bg-white grid grid-cols-3"
                     style="grid-column-gap: 10px; position: sticky; top: 0; z-index: 100">
                    <!-- First Column -->
                    <div class="flex gap-15">
                        <uui-avatar img-src="${this._lead?.photo?.file_path}"  style="font-size: 55px" name="${this._lead?.name}"></uui-avatar>
                        <div class="flex" style="flex-direction: column; justify-content: space-between; gap: 10px;">
                            <h2 class="m-0">${this._lead?.name}</h2>
                            <p class="m-0">${this._lead?.role ?? 'Works'} at ${this._lead?.company}</p>
                            <div class="flex gap-5" style="align-items: center">
                                <!-- TODO: get href from api -->
                                ${when(
                                    this._lead?.facebook_url,
                                        () => html`<a href="${this._lead?.facebook_url}" target="_blank">
                                            <svg height="24px"
                                                 id="facebook-icon"
                                                 class="social-icons"
                                                 style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
                                                 version="1.1" viewBox="0 0 512 512" width="24px" xml:space="preserve"
                                                 xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/"
                                                 xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M449.446,0c34.525,0 62.554,28.03 62.554,62.554l0,386.892c0,34.524 -28.03,62.554 -62.554,62.554l-106.468,0l0,-192.915l66.6,0l12.672,-82.621l-79.272,0l0,-53.617c0,-22.603 11.073,-44.636 46.58,-44.636l36.042,0l0,-70.34c0,0 -32.71,-5.582 -63.982,-5.582c-65.288,0 -107.96,39.569 -107.96,111.204l0,62.971l-72.573,0l0,82.621l72.573,0l0,192.915l-191.104,0c-34.524,0 -62.554,-28.03 -62.554,-62.554l0,-386.892c0,-34.524 28.029,-62.554 62.554,-62.554l386.892,0Z"/></svg>
                                        </a>`    
                                )}
                                ${when(
                                        this._lead?.linkedin_url,
                                        () => html`<a href="${this._lead?.linkedin_url}" target="_blank">
                                            <svg height="24px"
                                                 id="linkedin-icon"
                                                 class="social-icons"
                                                 style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
                                                 version="1.1" viewBox="0 0 512 512" width="24px" xml:space="preserve"
                                                 xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/"
                                                 xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M449.446,0c34.525,0 62.554,28.03 62.554,62.554l0,386.892c0,34.524 -28.03,62.554 -62.554,62.554l-386.892,0c-34.524,0 -62.554,-28.03 -62.554,-62.554l0,-386.892c0,-34.524 28.029,-62.554 62.554,-62.554l386.892,0Zm-288.985,423.278l0,-225.717l-75.04,0l0,225.717l75.04,0Zm270.539,0l0,-129.439c0,-69.333 -37.018,-101.586 -86.381,-101.586c-39.804,0 -57.634,21.891 -67.617,37.266l0,-31.958l-75.021,0c0.995,21.181 0,225.717 0,225.717l75.02,0l0,-126.056c0,-6.748 0.486,-13.492 2.474,-18.315c5.414,-13.475 17.767,-27.434 38.494,-27.434c27.135,0 38.007,20.707 38.007,51.037l0,120.768l75.024,0Zm-307.552,-334.556c-25.674,0 -42.448,16.879 -42.448,39.002c0,21.658 16.264,39.002 41.455,39.002l0.484,0c26.165,0 42.452,-17.344 42.452,-39.002c-0.485,-22.092 -16.241,-38.954 -41.943,-39.002Z"/></svg>
                                        </a>`
                                )}
                                ${when(
                                        this._lead?.instagram_url,
                                        () => html`<a href="${this._lead?.instagram_url}" target="_blank">
                                            <svg height="24px"
                                                 id="instagram-icon"
                                                 class="social-icons"
                                                 style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
                                                 version="1.1" viewBox="0 0 512 512" width="24px" xml:space="preserve"
                                                 xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/"
                                                 xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M449.446,0c34.525,0 62.554,28.03 62.554,62.554l0,386.892c0,34.524 -28.03,62.554 -62.554,62.554l-386.892,0c-34.524,0 -62.554,-28.03 -62.554,-62.554l0,-386.892c0,-34.524 28.029,-62.554 62.554,-62.554l386.892,0Zm-193.446,81c-47.527,0 -53.487,0.201 -72.152,1.053c-18.627,0.85 -31.348,3.808 -42.48,8.135c-11.508,4.472 -21.267,10.456 -30.996,20.184c-9.729,9.729 -15.713,19.489 -20.185,30.996c-4.326,11.132 -7.284,23.853 -8.135,42.48c-0.851,18.665 -1.052,24.625 -1.052,72.152c0,47.527 0.201,53.487 1.052,72.152c0.851,18.627 3.809,31.348 8.135,42.48c4.472,11.507 10.456,21.267 20.185,30.996c9.729,9.729 19.488,15.713 30.996,20.185c11.132,4.326 23.853,7.284 42.48,8.134c18.665,0.852 24.625,1.053 72.152,1.053c47.527,0 53.487,-0.201 72.152,-1.053c18.627,-0.85 31.348,-3.808 42.48,-8.134c11.507,-4.472 21.267,-10.456 30.996,-20.185c9.729,-9.729 15.713,-19.489 20.185,-30.996c4.326,-11.132 7.284,-23.853 8.134,-42.48c0.852,-18.665 1.053,-24.625 1.053,-72.152c0,-47.527 -0.201,-53.487 -1.053,-72.152c-0.85,-18.627 -3.808,-31.348 -8.134,-42.48c-4.472,-11.507 -10.456,-21.267 -20.185,-30.996c-9.729,-9.728 -19.489,-15.712 -30.996,-20.184c-11.132,-4.327 -23.853,-7.285 -42.48,-8.135c-18.665,-0.852 -24.625,-1.053 -72.152,-1.053Zm0,31.532c46.727,0 52.262,0.178 70.715,1.02c17.062,0.779 26.328,3.63 32.495,6.025c8.169,3.175 13.998,6.968 20.122,13.091c6.124,6.124 9.916,11.954 13.091,20.122c2.396,6.167 5.247,15.433 6.025,32.495c0.842,18.453 1.021,23.988 1.021,70.715c0,46.727 -0.179,52.262 -1.021,70.715c-0.778,17.062 -3.629,26.328 -6.025,32.495c-3.175,8.169 -6.967,13.998 -13.091,20.122c-6.124,6.124 -11.953,9.916 -20.122,13.091c-6.167,2.396 -15.433,5.247 -32.495,6.025c-18.45,0.842 -23.985,1.021 -70.715,1.021c-46.73,0 -52.264,-0.179 -70.715,-1.021c-17.062,-0.778 -26.328,-3.629 -32.495,-6.025c-8.169,-3.175 -13.998,-6.967 -20.122,-13.091c-6.124,-6.124 -9.917,-11.953 -13.091,-20.122c-2.396,-6.167 -5.247,-15.433 -6.026,-32.495c-0.842,-18.453 -1.02,-23.988 -1.02,-70.715c0,-46.727 0.178,-52.262 1.02,-70.715c0.779,-17.062 3.63,-26.328 6.026,-32.495c3.174,-8.168 6.967,-13.998 13.091,-20.122c6.124,-6.123 11.953,-9.916 20.122,-13.091c6.167,-2.395 15.433,-5.246 32.495,-6.025c18.453,-0.842 23.988,-1.02 70.715,-1.02Zm0,53.603c-49.631,0 -89.865,40.234 -89.865,89.865c0,49.631 40.234,89.865 89.865,89.865c49.631,0 89.865,-40.234 89.865,-89.865c0,-49.631 -40.234,-89.865 -89.865,-89.865Zm0,148.198c-32.217,0 -58.333,-26.116 -58.333,-58.333c0,-32.217 26.116,-58.333 58.333,-58.333c32.217,0 58.333,26.116 58.333,58.333c0,32.217 -26.116,58.333 -58.333,58.333Zm114.416,-151.748c0,11.598 -9.403,20.999 -21.001,20.999c-11.597,0 -20.999,-9.401 -20.999,-20.999c0,-11.598 9.402,-21 20.999,-21c11.598,0 21.001,9.402 21.001,21Z"/></svg>
                                        </a>`
                                )}
                            </div>
                            <div>
                                <!-- TODO: add last contacted field on lead -->
                                <h4 class="m-0">Last Contacted</h4>
                                <span class="flex gap-5" style="align-items: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                         stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle
                                            cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <!-- TODO: get this from api -->
                                    <p class="m-0">
                                        ${this._lead?.last_contacted
                                             ? new Date(this._lead.last_contacted).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                             : 'never'}
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Second and Third Columns (subgrid) -->
                    <div style="grid-column: span 2;" class="grid-container">
                        <div class="grid-item">
                            <h4 class="m-0" style="grid-column: span 2">Contact Info</h4>
                            <div class="m-0">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16"
                                                                                                  x="2" y="4" rx="2"/><path
                                            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                    Work Email
                                </span>
                                <p class="m-0">${this._lead?.email}</p>
                            </div>
                            <div class="m-0">
                                <span>
                                    <svg id="phone-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="lucide lucide-phone"><path
                                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    Work Phone
                                </span>
                                <p class="m-0">${this._lead?.phone}</p>
                            </div>
                            <div class="m-0" style="grid-column: span 2">
                                <span>
                                    <svg id="map-pin-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="lucide lucide-map-pin"><path
                                            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle
                                            cx="12" cy="10" r="3"/></svg>
                                    <!-- TODO: add lead address -->
                                    Work Address
                                </span>
                                <p class="m-0">fake address, 234 - ST</p>
                            </div>
                        </div>
                        <div class="grid-item">
                            <!-- TODO: Add possibility to add or remove tags, make them scroll horizontally with overflow -->
                            <h4 class="m-0" style="grid-column: span 2">Tags</h4>
                            <div class="flex gap-5 flex-wrap" style="height: max-content; grid-column: span 2">
                                <!-- TODO: this needs to come from the lead itself -->
                                <uui-tag color="positive">waiting for reply</uui-tag>
                                <uui-tag color="warning">to reply</uui-tag>
                            </div>
                            <div>
                                <!-- TODO: investigate how will i calculate the lead score (maybe think about some ai stuff people love AI stuff -->
                                <h4 class="m-0">Lead Score</h4>
                                <igc-circular-progress value="95"
                                                       style="--ig-circular-progress-diameter: 2rem; --ig-circular-progress-progress-circle-color: green;"></igc-circular-progress>
                            </div>
                            <div>
                                <!-- TODO: fetch this on the lead itself -->
                                <h4 class="m-0">Lead Owner</h4>
                                <uui-avatar-group style="--uui-avatar-border-color: #ffffff;">
                                    <!-- TODO: loop through the user owners -->
                                    <uui-avatar name="Mads Rasmussen"></uui-avatar>
                                    <uui-avatar name="Niels Lyngsø"></uui-avatar>
                                    <uui-avatar name="Jacob Overgaard"></uui-avatar>
                                    <uui-avatar name="Jesper Møller Jensen"></uui-avatar>
                                </uui-avatar-group>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="p-20 grid grid-cols-12 column-gap-10">

                    <!-- Main Content Left Container -->
                    <uui-box class="grid-col-span-8" style="--uui-box-default-padding: 0;">
                        <div style="padding: 0 20px;">
                            <progress-bar
                                    @stage-clicked="${this._changeLeadStage}"
                                    .stages=${
                                        this._leadStatusOptions
                                    }
                                    .currentStage="${this._lead?.status}"
                            ></progress-bar>
                        </div>

                        <hr style="border-bottom: 1px solid var(--uui-color-divider-standalone); border-top: none;"/>
                        <!-- Main content lead relationships (emails, calls, tasks, meetings) -->
                        <uui-tab-group @click=${this.#onTabChange}>
                            <uui-tab data-tab="emails" label="Emails" active="">Emails</uui-tab>
                            <uui-tab data-tab="calls" label="Calls">Calls</uui-tab>
                            <uui-tab data-tab="tasks" label="Tasks">Tasks</uui-tab>
                            <uui-tab data-tab="meetings" label="Meetings">Meetings</uui-tab>
                        </uui-tab-group>
                        <div class="tab-group-content" style="padding: 18px">
                            ${choose(this.selectedTab, [
                                        ['emails', () => this.renderEmailTabContent()],
                                        ['calls', () => this.renderCallsTabContent()],
                                        ['tasks', () => this.renderTasksTabContent()],
                                        ['meetings', () => this.renderMeetingsTabContent()]
                                    ],
                                    () => html`<h1>Error</h1>`)}
                        </div>
                    </uui-box>

                    <!-- Main Content Right Container -->
                    <uui-box class="grid-col-span-4">
                        <div style="display: flex; flex-direction: column; gap: 10px; height: 100%;">

                            <!-- Activities box -->
                            <div class="flex" style="justify-content: space-between; width: 100%">
                                <h4 class="m-0">
                                    Upcoming Activities
                                </h4>
                                <span>
                                    <uui-button>Create Activity</uui-button>
                                    <uui-button>See All</uui-button>
                                </span>
                            </div>
                            <uui-box>
                                <div>
                                    <div class="flex" style="justify-content: space-between; width: 100%;">
                                        <h4 class="m-0">Activity title</h4>
                                        <p class="m-0">in 4 days</p>
                                    </div>
                                    <p>Activity description</p>
                                    <div class="grid grid-cols-3">
                                        <p>reminders</p>
                                        <p>priority</p>
                                        <p>Assigned to</p>
                                    </div>
                                </div>
                            </uui-box>

                            <!-- Notes box -->
                            <div class="flex" style="justify-content: space-between">
                                <h4 class="m-0">
                                    Latest Notes
                                </h4>
                                <span>
                                    <uui-button>Create Note</uui-button>
                                    <uui-button>See All</uui-button>
                                </span>
                            </div>
                            <uui-box>
                                <div slot="header" class="flex" style="justify-content: space-between; width: 100%;">
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                             stroke-linecap="round" stroke-linejoin="round"
                                             class="lucide lucide-notepad-text"><path d="M8 2v4"/><path d="M12 2v4"/><path
                                                d="M16 2v4"/><rect width="16" height="18" x="4" y="4" rx="2"/><path
                                                d="M8 10h6"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>
                                        Note by User Name
                                    </span>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                             viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                             stroke-linejoin="round"
                                             class="lucide lucide-calendar-clock">
                                            <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/>
                                            <path d="M16 2v4"/>
                                            <path d="M8 2v4"/>
                                            <path d="M3 10h5"/>
                                            <path d="M17.5 17.5 16 16.3V14"/>
                                            <circle cx="16" cy="16" r="6"/>
                                        </svg>
                                        Today, 12:00 PM
                                    </div>
                                </div>
                                <p>Note Text</p>
                            </uui-box>

                            <!-- Last Deal box -->
                            <div class="flex" style="justify-content: space-between">
                                <h4 class="m-0">
                                    Last Deals
                                </h4>
                                <span>
                                    <uui-button>Create Deal</uui-button>
                                    <uui-button>See All</uui-button>
                                </span>
                            </div>
                            <uui-box>
                                <div slot="header" class="flex" style="justify-content: space-between; width: 100%;">
                                    <span>
                                        Closing Date 27/04/2025
                                    </span>
                                    <div>
                                        <uui-tag color="default">Deal Phase</uui-tag>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="m-0">Deal Title</h4>
                                    <p class="m-0">Deal Value</p>
                                </div>
                            </uui-box>
                        </div>
                    </uui-box>
                </div>
            </umb-workspace-editor>
        `
    }

    static styles = [
        css`
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

            [id$="-label"] {
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
        `,
    ];
 
}

export default CreateOrEditObjectLeadsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        'view-object-leads-workspace': CreateOrEditObjectLeadsWorkspaceElement
    }
}