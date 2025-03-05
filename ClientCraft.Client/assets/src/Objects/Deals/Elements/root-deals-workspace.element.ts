// @ts-nocheck
import {UmbElementMixin}
    from "@umbraco-cms/backoffice/element-api";
import {LitElement, css, html, customElement, state, repeat}
    from "@umbraco-cms/backoffice/external/lit";
import {CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN} from "../Context";
import {UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext} from "@umbraco-cms/backoffice/modal";
import UmbObjectDealsWorkspaceContext from "../Context/object-deals-workspace.context.ts";
import {DealModel, DealStatusModel, LeadModel} from "../../../api/laravel-api-client";
import {CREATE_DEAL_MODAL} from "../Dialogs/CreateDealDialog/create-deal-dialog-token.ts";


export interface DealTableItem extends DealModel {
    status: DealStatusModel;
}

@customElement('root-object-deals-workspace')
export class RootObjectDealsWorkspaceElement extends UmbElementMixin(LitElement) {
    private _modalContext?: UmbModalManagerContext

    constructor() {
        super();

        this.consumeContext(CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._dealsContext = _instance;
        });

        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            this._modalContext = _instance;
        });
    }

    @state()
    private _columns: Array<TableColumn> = [];

    @state()
    private _items: Array<DealTableItem> = [];

    private _dealsContext?: UmbObjectDealsWorkspaceContext

    async connectedCallback() {
        super.connectedCallback();

        await this.getDeals();
    }

    async getDeals() {
        const response = await this._dealsContext?.service.deals.getDealsTable();
        if (response?.data && 'data' in response.data) {
            const data = response.data.data;
            console.log('response', data);

            this._columns = [
                // @ts-ignore TODO: Add typing here?
                ...data.headers,
                {
                    name: 'Actions',
                    sortable: false,
                },
            ];

            this._items = [
                // @ts-ignore TODO: Add typing here?
                ...this._dealsContext.service.deals.toTableItems(data.data)
            ];
        }
    }

    async openCreateModal() {
        const customContext = this._modalContext?.open(this, CREATE_DEAL_MODAL, {
            data: {
                headline: 'Create Deal',
                // _contactsService: this._dealsContext?.service.contacts,
                // _accountsService: this._dealsContext?.service.accounts,
                _dealsContext: this._dealsContext?.service,
            }
        });

        const data = await customContext?.onSubmit();

        await this.getDeals();
    }

    render() {
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.deals.workspace.root"
                    .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_deals')}</h3>
                    <!-- TODO: try to find a better approach for route creation -->
                    <uui-button pristine="" label="Create"
                                look="primary" style="--uui-button-height: min-content"
                                @click="${this.openCreateModal}">
                        <uui-icon name="add"></uui-icon>
                        Create
                    </uui-button>
                </div>
                <div class="p-20">
                    <uui-box>
                        <cc-table .items="${this._items}" .columns="${this._columns}"></cc-table>
                    </uui-box>
                </div>
            </umb-workspace-editor>
        `
    }

    static styles = [
        css`
            uui-table-row uui-checkbox {
                display: none;
            }

            uui-table-row:focus uui-icon[hide-on-hover],
            uui-table-row:focus-within uui-icon[hide-on-hover],
            uui-table-row:hover uui-icon[hide-on-hover],
            uui-table-row[select-only] uui-icon[hide-on-hover] {
                display: none;
            }

            uui-table-row:focus uui-checkbox,
            uui-table-row:focus-within uui-checkbox,
            uui-table-row:hover uui-checkbox,
            uui-table-row[select-only] uui-checkbox {
                display: inline-block;
            }

            uui-table-head-cell:focus,
            uui-table-head-cell:focus-within,
            uui-table-head-cell:hover {
                --uui-symbol-sort-hover: 1;
            }

            uui-table-head-cell button {
                padding: 0;
                background-color: transparent;
                color: inherit;
                border: none;
                cursor: pointer;
                font-weight: inherit;
                font-size: inherit;
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
            }

            .p-20 {
                padding: 20px;
            }
        `,
    ];

}

export default RootObjectDealsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        'root-object-deals-workspace': RootObjectDealsWorkspaceElement
    }
}