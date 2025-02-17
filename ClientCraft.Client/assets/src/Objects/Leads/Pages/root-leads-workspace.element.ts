// @ts-nocheck
import {UmbElementMixin}
    from "@umbraco-cms/backoffice/element-api";
import {LitElement, css, html, customElement, state, repeat, when}
    from "@umbraco-cms/backoffice/external/lit";
import {UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext} from "@umbraco-cms/backoffice/modal";
import {CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN} from "../Context";
import UmbObjectLeadsWorkspaceContext from "../Context/object-leads-workspace.context.ts";
import {LeadModel} from "../../../api/laravel-api-client";
import {BaseException} from "../../../Exceptions/BaseException/base.exception.ts";

interface TableColumn {
    name: string;
    sortable: boolean;
    sort?: Function;
}

export const LeadStatusColors = ["default", "positive", "warning", "danger"] as const;
export interface LeadStatuses {
    id: number;
    label: string;
    color: (typeof LeadStatusColors)[number];
}

export interface LeadTableItem extends Omit<LeadModel, 'status'> {
    status: LeadStatuses;
}

@customElement('root-object-leads-workspace')
export class RootObjectLeadsWorkspaceElement extends UmbElementMixin(LitElement) {

    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            this._modalContext = _instance;
        });
        this.consumeContext(CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._leadsContext = _instance;
        });
    }

    @state()
    private _columns: Array<TableColumn> = [];

    @state()
    private _items: Array<LeadTableItem> = [];

    @state()
    private _selectionMode = false;

    @state()
    private _selection: Array<number> = [];

    @state()
    private _sortingColumn: any = '';

    @state()
    private _sortingDesc = false;

    @state()
    private _isCreateDropdownOpen = false;

    @state()
    private _leadStatuses: LeadStatuses[] | undefined;

    private _selectAllHandler(event: Event) {
        const checkboxElement = event.target as HTMLInputElement;
        this._selection = checkboxElement.checked
            ? this._items.flatMap((item: LeadTableItem) => item.id ?? [])
            : [];
        this._selectionMode = this._selection.length > 0;
    }

    private _selectHandler(event: Event, item: LeadTableItem) {
        console.log(event.currentTarget)
        const checkboxElement = event.target as HTMLInputElement;
        this._selection = checkboxElement.checked
            ? item.id ? [...this._selection, item.id] : [...this._selection]
            : this._selection.filter(selectionKey => item.id !== selectionKey);
        this._selectionMode = this._selection.length > 0;
    }

    private _selectRowHandler(item: LeadTableItem) {
        this._selection = item.id ? [...this._selection, item.id] : [...this._selection];
        this._selectionMode = this._selection.length > 0;
    }

    private _deselectRowHandler(item: LeadTableItem) {
        this._selection = this._selection.filter(
            selectionKey => item.id && item.id !== selectionKey,
        );
        this._selectionMode = this._selection.length > 0;
    }

    private _sortingHandler(column: TableColumn) {
        if (column.sortable) {
            return;
        }

        this._sortingDesc =
            this._sortingColumn === column.name ? !this._sortingDesc : false;
        this._sortingColumn = column.name;
        this._items = column.sort!(this._items, this._sortingDesc);
    }

    private _isSelected(key: number) {
        return this._selection.includes(key);
    }

    private _modalContext?: UmbModalManagerContext
    private _leadsContext?: UmbObjectLeadsWorkspaceContext

    private async _deleteLeadHandler(e: MouseEvent, item: string) {
        e.stopPropagation();

        await this._openDeleteLeadModal(item);
    }

    private async _openDeleteLeadModal(itemId: string) {
        const customContext = this._modalContext?.open(this, DELETE_LEAD_MODAL, {
            data: {
                headline: 'Delete Lead',
                deleteItemId: itemId
            }
        });

        const data = await customContext?.onSubmit();

        if (data?.delete) {
            this._items = this._items.filter(x => {
                return x.id && x.id.toString() !== itemId;
            });
        }
    }

    async connectedCallback() {
        super.connectedCallback();

        const response = await this._leadsContext?.service.leads.getLeadsTable();
        // @ts-ignore
        if (response?.data && 'data' in response.data) {
            // @ts-ignore
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
                ...this._leadsContext.service.leads.toTableItems(data.data)
            ];
        }

        this._leadStatuses = await this._leadsContext?.service.leads.getLeadStatuses() ?? [];
    }

    async _handleLeadStatusChange(lead: LeadModel, leadStatus: LeadStatuses) {
        lead.lead_status_id = leadStatus.id;
        lead.status = leadStatus;
        
        if (lead.id) {
            const result = await this._leadsContext?.service.leads.updateLead(lead.id.toString(), lead);

            // @ts-ignore
            if (BaseException.IsAxiosError(result?.data?.name)) {
                console.log(result);
                return;
            }
            // Update the items array to trigger reactivity
            this._items = this._items.map(item =>
                item.id === lead.id ? { ...item, status: leadStatus, lead_status_id: leadStatus.id } : item
            );
        }
    }

    handleCreateButtonClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        console.log(e.target);
    }

    renderHeaderCellTemplate(column: TableColumn) {
        return html`
            <uui-table-head-cell style="--uui-table-cell-padding: 0">
                ${column.sortable
                        ? html`
                            <button
                                    style="padding: 12px 15px;"
                                    @click="${() => this._sortingHandler(column)}">
                                ${column.name}
                                <uui-symbol-sort
                                        ?active="${this._sortingColumn === column.name}"
                                        ?descending="${this._sortingDesc}">
                                </uui-symbol-sort>
                            </button>
                        `
                        : html`<p style="padding: 12px 15px;">${column.name}</p>`}
            </uui-table-head-cell>
        `;
    }

    protected renderEmptyStateRow = () => {
        return html`
            <div class="empty-state">
                <p>
                    No items available.
                </p>
            </div>
        `;
    }
    protected renderRowTemplate = (item: LeadTableItem) => {
        return html`
            <uui-table-row
                    selectable
                    ?select-only=${this._selectionMode}
                    ?selected=${item.id && this._isSelected(item.id)}
                    @selected=${() => this._selectRowHandler(item)}
                    @deselected=${() => this._deselectRowHandler(item)}>
                <uui-table-cell>
                    <uui-icon hide-on-hover name="wand" style="font-size: 20px;"></uui-icon>
                    <uui-checkbox
                            @click=${(e: MouseEvent) => e.stopPropagation()}
                            @change=${(event: Event) => this._selectHandler(event, item)}
                            ?checked="${item.id && this._isSelected(item.id)}"></uui-checkbox>
                </uui-table-cell>
                <uui-table-cell>
                    <div style="display: flex; align-items: center;">
                        <uui-avatar name="${item.name}" style="margin-right: 10px;">
                        </uui-avatar>
                    </div>
                </uui-table-cell>
                <uui-table-cell>
                    <div style="display: flex; align-items: center;">
                        ${repeat(item.owners ?? [], (item) => item.id, (item) => (html`
                            <uui-avatar name="${item.name}" style="margin-right: 10px;">
                            </uui-avatar>
                        `))}
                    </div>
                </uui-table-cell>
                <uui-table-cell>
                    ${item.name}
                </uui-table-cell>
                <uui-table-cell>
                    ${item.email}
                </uui-table-cell>
                <uui-table-cell>${item.phone}</uui-table-cell>
                <uui-table-cell>${item.email}</uui-table-cell>
                <uui-table-cell>
                    <igc-dropdown id="status-dropdown" same-width @click=${(e: MouseEvent) => e.stopPropagation()}
                                  style="--background-color: white;">
                        <igc-button slot="target">
                            <uui-tag color="${item.status?.color}" size="s"
                            >${item.status?.label}
                            </uui-tag
                            >
                        </igc-button>
                        ${when(this._leadStatuses,
                                () => repeat(
                                        this._leadStatuses!,
                                        (leadStatus) => leadStatus.label,
                                        (leadStatus) => (html`
                                    <igc-dropdown-item @click="${() => this._handleLeadStatusChange(item, leadStatus)}">${leadStatus.label}</igc-dropdown-item>
                                `)
                                )
                        )}
                        
                        
                    </igc-dropdown>

                </uui-table-cell>
                <uui-table-cell>
                    <uui-action-bar>
                        <uui-button pristine="" label="edit" title="edit"
                                    href="/umbraco/section/client-craft/workspace/leads/edit/${item.id}"
                                    @click=${(e: MouseEvent) => e.stopPropagation()}>
                            <uui-icon name="edit"></uui-icon>
                        </uui-button>
                        <uui-button pristine="" label="view" title="view"
                                    href="/umbraco/section/client-craft/workspace/leads/view/${item.id}"
                                    @click=${(e: MouseEvent) => e.stopPropagation()}>
                            <uui-icon name="see"></uui-icon>
                        </uui-button>
                        <uui-button pristine="" label="delete" title="delete"
                                    @click=${(e: MouseEvent) => this._deleteLeadHandler(e, item.id?.toString() ?? '')}>
                            <uui-icon name="delete"></uui-icon>
                        </uui-button>
                    </uui-action-bar>
                </uui-table-cell>
            </uui-table-row>`;
    };

    render() {
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.leads.workspace.root"
                    .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_leads')}</h3>
                    <!-- TODO: try to find a better approach for route creation -->

                    <span style="display: flex;">
                         <igc-dropdown @igcOpened="${() => this._isCreateDropdownOpen = true}"
                                       @igcClosed="${() => this._isCreateDropdownOpen = false}" id="create-dropdown"
                                       placement="bottom-end" same-width>
                            <igc-button slot="target">
                                 <uui-button id="create-button" @click="${(e: MouseEvent) => e.stopPropagation()}"
                                             pristine=""
                                             href="/umbraco/section/client-craft/workspace/leads/create" label="Create"
                                             look="primary"
                                             style="--uui-button-height: min-content; --uui-border-radius: 0">
                                Create
                                </uui-button>
                                <uui-button id="create-button" pristine=""
                                            look="primary"
                                            style="--uui-button-height: min-content; --uui-border-radius: 0; --uui-button-merge-border-left: 4; --uui-button-padding-left-factor: 2; --uui-button-padding-right-factor: 2">
                                    <uui-symbol-expand .open="${this._isCreateDropdownOpen}"></uui-symbol-expand>
                                </uui-button>
                            </igc-button>
                            <igc-dropdown-item @click="${() => alert('This feature is still not implemented')}">Import Bulk</igc-dropdown-item>
                        </igc-dropdown>
                    </span>
                </div>
                <div class="p-20">
                    <uui-box>
                        <div style="margin-bottom: 20px;">
                            Selected ${this._selection.length} of ${this._items.length}
                        </div>

                        <div class="table-container">
                            <uui-table class="uui-text">
                                <uui-table-column style="width: 60px;"></uui-table-column>

                                <uui-table-head>
                                    <uui-table-head-cell style="--uui-table-cell-padding: 0">
                                        <uui-checkbox
                                                style="padding: 12px 15px;"
                                                @change="${this._selectAllHandler}"
                                                ?checked="${this._selection.length ===
                                                this._items.length}"></uui-checkbox>
                                    </uui-table-head-cell>
                                    ${this._columns.map(column => this.renderHeaderCellTemplate(column))}
                                </uui-table-head>

                                ${when(
                                        this._items.length > 0,
                                        () =>
                                                html`${repeat(
                                                        this._items,
                                                        (item) => item.id,
                                                        (item) => this.renderRowTemplate(item)
                                                )}`
                                )}
                            </uui-table>
                            ${when(
                                    this._items.length === 0,
                                    this.renderEmptyStateRow
                            )}
                        </div>
                    </uui-box>
                </div>
            </umb-workspace-editor>
        `
    }

    static styles = [
        css`

            uui-tag {
                text-wrap: nowrap;    
            }
            
            uui-table-row uui-checkbox {
                display: none;
            }

            igc-button {
                border-radius: calc(0.2 * 1.25rem);
                overflow: hidden;
            }

            igc-dropdown {
                --elevation: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
            }

            .table-container {
                overflow-x: auto;
            }

            igc-dropdown-item {
                --hover-item-background: #F3F3F5;
                
                padding: var(--uui-size-3);
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

            .empty-state {
                text-align: center;
            }
        `,
    ];

}

export default RootObjectLeadsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        'root-object-leads-workspace': RootObjectLeadsWorkspaceElement
    }
}