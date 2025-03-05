// @ts-nocheck
import { UmbElementMixin }
    from "@umbraco-cms/backoffice/element-api";
import { LitElement, css, html, customElement, state, query, property }
    from "@umbraco-cms/backoffice/external/lit";
import {UUIInputEvent} from "@umbraco-ui/uui-input/lib"
import { CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN } from "../Context";
import UmbObjectDealsWorkspaceContext from "../Context/object-deals-workspace.context.ts";
import { DealModel } from "../../../api/laravel-api-client";
import {UUIButtonElement} from "@umbraco-cms/backoffice/external/uui";

interface StoreDealForm {
    deal: DealModel,
    state: "waiting" | null;
    setState: (state: 'waiting' | null) => void,
}

@customElement('create-object-deals-workspace')
export class CreateOrEditObjectDealsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _dealsContext?: UmbObjectDealsWorkspaceContext
    @query('#storeDealReset')
    _storeDealReset: UUIButtonElement | undefined;
    @property()
    backPath: string = '/umbraco/section/client-craft/workspace/deals';
    constructor() {
        super();
        this.consumeContext(CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._dealsContext = _instance;
        });
        
        this._storeDealForm = {
            deal: {
                id: undefined,
                name: '',
                amount: 0,
                deal_status_id: undefined,
                close_date: undefined,
                priority: 'low',
                user_id: undefined,
                deal_type_id: undefined,
            },
            state: null,
            setState: (state: null | 'waiting') => {
                this._storeDealForm = {...this._storeDealForm, state};
            },
        };
    }
    
    isEditingDeal() {
        return this._dealsContext?.currentRoute?.params.id;
    }
    
    async connectedCallback() {
        super.connectedCallback();

        const params = new URLSearchParams(window.location.search);
        const backPathParam = params.get('backPath');
        if (backPathParam) {
            this.backPath = backPathParam;
        }
        
        // TODO: move this to the context route setup???
        if (!this._dealsContext?.currentRoute?.params.id) {
            // navigate out??
            return;
        }

        // Duplicated ID: 3547951 // This indicates the ID of the duplicated code. Search for this id in order to find places where code is duplicated
        // TODO: abstract that out of here??? Maybe a getter (we have repeated logic for this)
        const currentDeal = await this._dealsContext?.service.deals.getDeal(
            this._dealsContext?.currentRoute?.params.id
        );

        this._storeDealForm = { ...this._storeDealForm, ...currentDeal.data?.data };
    }
    
    // TODO: Maybe extract this to a method to handle forms?? Probably try to do something like Laravel Form Requests?
    private async _handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        e.stopPropagation();

        const i= e.target as HTMLFormElement;

        if(!i.checkValidity()) return;

        this._storeDealForm.setState("waiting");

        const m = new FormData(i) as DealModel;

        if (this.isEditingDeal() && this._storeDealForm.deal.id) {
            await this._dealsContext?.service.deals.updateDeal(this._storeDealForm.deal.id.toString(), m)
        } else {
            await this._dealsContext?.service.deals.createDeal(m);
            this._storeDealReset?.click();
        }

        console.log(this._storeDealForm.setState);
        this._storeDealForm.setState(null);
    }
    
    @state()
    private _storeDealForm: StoreDealForm;

    render() {
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.deals.workspace.root"
                    back-path="${this.backPath}"
                    .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_deals')}</h3>
                </div>
                <div class="p-20">
                    <uui-form>
                        <form id="storeDealForm" name="storeDealForm" @submit="${this._handleSubmit}">
                            <uui-box headline="Personal Information">
                                <div class="grid grid-cols-3">
                                    <uui-form-layout-item>
                                        <uui-label for="firstName" slot="label" required>Name</uui-label>
                                        <uui-input
                                                id="firstName"
                                                name="first_name"
                                                type="text"
                                                label="First Name"
                                                .value="${this._storeDealForm.deal.name || ''}"
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
                                                .value="${this._storeDealForm.deal.email || ''}"
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
                                                .value="${this._storeDealForm.deal.phone || ''}"
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
                                                .value="${this._storeDealForm.deal.address || ""}"
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
                                <uui-button .state="${this._storeDealForm.state}" type="submit" label="Submit"
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

export default CreateOrEditObjectDealsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        // @ts-ignore
        'create-object-deals-workspace': CreateOrEditObjectDealsWorkspaceElement
    }
}