import {UmbElementMixin} from '@umbraco-cms/backoffice/element-api';
import {property, css, html, LitElement, repeat, state, when} from '@umbraco-cms/backoffice/external/lit';
import {DealTableItem} from "../Objects/Deals/Elements/root-deals-workspace.element.ts";
import {DELETE_DEAL_MODAL} from "../Objects/Deals/Dialogs/DeleteDealDialog/delete-deal-dialog-token.ts";
import {UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext} from '@umbraco-cms/backoffice/modal';

interface TableColumn {
    name: string;
    field: string;
    nameField: string;
    sortable: boolean;
    sort?: Function;
    type: 'avatar' | 'text' | 'number' | 'currency' | 'tag';
}

export class ClientCraftTable extends UmbElementMixin(LitElement) {

    @property({type: Array})
    private items: DealTableItem[] = [];

    @property({type: Array})
    private columns: Array<TableColumn> = [];

    @state()
    private _selectionMode = false;

    @state()
    private _selection: Array<number> = [];

    @state()
    private _sortingColumn: any = '';

    @state()
    private _sortingDesc = false;

    private _modalContext?: UmbModalManagerContext;

    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            this._modalContext = _instance;
        });
    }

    private _selectAllHandler(event: Event) {
        const checkboxElement = event.target as HTMLInputElement;
        this._selection = checkboxElement.checked
            ? this.items?.flatMap((item: DealTableItem) => item.id ?? [])
            : [];
        this._selectionMode = this._selection.length > 0;
    }

    private _selectHandler(event: Event, item: DealTableItem) {
        const checkboxElement = event.target as HTMLInputElement;
        this._selection = checkboxElement.checked
            ? item.id ? [...this._selection, item.id] : [...this._selection]
            : this._selection.filter(selectionKey => selectionKey !== item.id);
        this._selectionMode = this._selection.length > 0;
    }

    private _selectRowHandler(item: DealTableItem) {
        this._selection = item.id ? [...this._selection, item.id] : [...this._selection];
        this._selectionMode = this._selection.length > 0;
    }

    private _deselectRowHandler(item: DealTableItem) {
        this._selection = this._selection.filter(
            selectionKey => selectionKey !== item.id,
        );
        this._selectionMode = this._selection.length > 0;
    }

    private _sortingHandler(column: TableColumn) {
        if (!column.sortable) {
            return;
        }

        this._sortingDesc =
            this._sortingColumn === column.name ? !this._sortingDesc : false;
        this._sortingColumn = column.name;
        this.items = column.sort!(this.items, this._sortingDesc);
    }

    private _isSelected(key: number) {
        return this._selection.includes(key);
    }

    private async _deleteItemHandler(e: MouseEvent, item: string) {
        e.stopPropagation();
        await this._openDeleteItemModal(item);
    }

    private async _openDeleteItemModal(itemId: string) {
        const customContext = this._modalContext?.open(this, DELETE_DEAL_MODAL, {
            data: {
                headline: 'Delete Deal',
                deleteItemId: itemId
            }
        });

        const data = await customContext?.onSubmit();

        if (data?.delete) {
            this.items = this.items?.filter(x => {
                return x.id && x.id.toString() !== itemId;
            });
        }
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

    protected renderCellTemplate = (item: DealTableItem, column: TableColumn) => {
        if (column.name === "Actions") {
            return;
        }
        switch (column.type) {
            case 'tag': 
                return html`
                    <uui-table-cell>
                        <uui-tag style="text-wrap: nowrap" color="${item.status?.color}" size="s"
                        >${item.status?.label}
                        </uui-tag>
                    </uui-table-cell>
                `;
            case 'avatar':
                return html`
                    <uui-table-cell id="${column.field}">
                        <div style="display: flex; align-items: center;">
                            <uui-avatar name="${item[column.nameField as keyof DealTableItem]}" img-src="${item[column.field as keyof DealTableItem]}" style="margin-right: 10px;">
                            </uui-avatar>
                        </div>
                    </uui-table-cell>
                `;
            case 'text':
                return html`
                    <uui-table-cell id="${column.field}">
                        ${item[column.field as keyof DealTableItem]}
                    </uui-table-cell>
                `;
            case 'number':
                return html`
                    <uui-table-cell id="${column.field}">
                        ${item[column.field as keyof DealTableItem]}
                    </uui-table-cell>
                `;
            case 'currency':
                return html`
                    <uui-table-cell id="${column.field}">
                        ${item[column.field as keyof DealTableItem]}
                    </uui-table-cell>
                `;
            default:
                return html`
                    <uui-table-cell>
                        ${item[column.field as keyof DealTableItem]}
                    </uui-table-cell>
                `;
        }
    }

    protected renderRowTemplate = (item: DealTableItem) => {
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
                ${this.columns.map(column => this.renderCellTemplate(item, column))}
                <uui-table-cell>
                    <uui-action-bar>
                        <uui-button pristine="" label="edit" title="edit"
                                    href="/umbraco/section/client-craft/workspace/deals/edit/${item.id}"
                                    @click=${(e: MouseEvent) => e.stopPropagation()}>
                            <uui-icon name="edit"></uui-icon>
                        </uui-button>
                        <uui-button pristine="" label="view" title="view"
                                    href="/umbraco/section/client-craft/workspace/deals/view/${item.id}"
                                    @click=${(e: MouseEvent) => e.stopPropagation()}>
                            <uui-icon name="see"></uui-icon>
                        </uui-button>
                        <uui-button pristine="" label="delete" title="delete"
                                    @click=${(e: MouseEvent) => this._deleteItemHandler(e, item.id?.toString() ?? '')}>
                            <uui-icon name="delete"></uui-icon>
                        </uui-button>
                    </uui-action-bar>
                </uui-table-cell>
            </uui-table-row>
        `;
    };

    render() {
        return html`
            <div>
                <div style="margin-bottom: 20px;">
                    Selected ${this._selection.length} of ${this.items?.length}
                </div>
                <uui-table class="uui-text">
                    <uui-table-column style="width: 60px;"></uui-table-column>

                    <uui-table-head>
                        <uui-table-head-cell style="--uui-table-cell-padding: 0">
                            <uui-checkbox
                                    style="padding: 12px 15px;"
                                    @change="${this._selectAllHandler}"
                                    ?checked="${this._selection.length ===
                                    this.items?.length}"></uui-checkbox>
                        </uui-table-head-cell>
                        ${this.columns?.map(column => this.renderHeaderCellTemplate(column))}
                    </uui-table-head>

                    ${when(this.items.length, () => repeat(this.items, item => item.id, this.renderRowTemplate), this.renderEmptyStateRow)}
                </uui-table>
            </div>
        `;
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

customElements.define('cc-table', ClientCraftTable);

declare global {
    interface HTMLElementTagNameMap {
        'cc-table': ClientCraftTable;
    }
}