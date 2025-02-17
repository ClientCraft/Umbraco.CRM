// @ts-nocheck
import {UmbElementMixin}
    from "@umbraco-cms/backoffice/element-api";
import {LitElement, css, html, customElement, state, repeat}
    from "@umbraco-cms/backoffice/external/lit";
import {UMB_MODAL_MANAGER_CONTEXT, UmbModalManagerContext} from "@umbraco-cms/backoffice/modal";
import { DELETE_ACCOUNT_MODAL } from "../Dialogs/DeleteAccountDialog/delete-account-dialog-token.ts";
import {CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN} from "../Context";
import UmbObjectAccountsWorkspaceContext from "../Context/object-accounts-workspace.context.ts";
import { AccountModel } from "../../../api/laravel-api-client";

interface TableColumn {
    name: string;
    sortable: boolean;
    sort?: Function;
}

export interface AccountTableItem extends Omit<AccountModel, 'status'> {
    status: {
        label: string;
        color: "default" | "positive" | "warning" | "danger" | "secondary"
    }
}

@customElement('root-object-accounts-workspace')
export class RootObjectAccountsWorkspaceElement extends UmbElementMixin(LitElement) {

    constructor() {
        super();
        this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (_instance) => {
            this._modalContext = _instance;
        });
        this.consumeContext(CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._accountsContext = _instance;
        });
    }

    @state()
    private _columns: Array<TableColumn> = [];

    @state()
    private _items: Array<AccountTableItem> = [];

    @state()
    private _selectionMode = false;

    @state()
    private _selection: Array<number> = [];

    @state()
    private _sortingColumn: any = '';

    @state()
    private _sortingDesc = false;

    private _selectAllHandler(event: Event) {
        const checkboxElement = event.target as HTMLInputElement;
        this._selection = checkboxElement.checked
            ? this._items.flatMap((item: AccountTableItem) => item.id ?? [])
            : [];
        this._selectionMode = this._selection.length > 0;
    }

    private _selectHandler(event: Event, item: AccountTableItem) {
        console.log(event.currentTarget)
        const checkboxElement = event.target as HTMLInputElement;
        this._selection = checkboxElement.checked
            ? item.id ? [...this._selection, item.id] : [...this._selection]
            : this._selection.filter(selectionKey => selectionKey !== item.id);
        this._selectionMode = this._selection.length > 0;
    }

    private _selectRowHandler(item: AccountTableItem) {
        this._selection = item.id ? [...this._selection,  item.id] : [...this._selection];
        this._selectionMode = this._selection.length > 0;
    }

    private _deselectRowHandler(item: AccountTableItem) {
        this._selection = this._selection.filter(
            selectionKey => selectionKey !== item.id,
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
    private _accountsContext?: UmbObjectAccountsWorkspaceContext

    private async _deleteAccountHandler(e: MouseEvent, item: string) {
        e.stopPropagation();

        await this._openDeleteAccountModal(item);
    }

    private async _openDeleteAccountModal(itemId: string) {
        const customContext = this._modalContext?.open(this, DELETE_ACCOUNT_MODAL, {
            data: {
                headline: 'Delete Account',
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

        const response = await this._accountsContext?.service.getAccountsTable();
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
                ...this._accountsContext.service.toTableItems(data.data)

            ];
        }

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
    protected renderRowTemplate = (item: AccountTableItem) => {
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
                    ${item.name}
                </uui-table-cell>
                <uui-table-cell>
                    ${item.website}
                </uui-table-cell>
                <uui-table-cell>${item.email}</uui-table-cell>
                <uui-table-cell>${item.phone}</uui-table-cell>
                <uui-table-cell>
                    <uui-tag color="${item.status?.color}" size="s">
                        ${item.status?.label}
                    </uui-tag>
                </uui-table-cell>
                <uui-table-cell>
                    <uui-action-bar>
                        <uui-button pristine="" label="edit" title="edit"
                                    href="/umbraco/section/client-craft/workspace/accounts/edit/${item.id}"
                                    @click=${(e: MouseEvent) => e.stopPropagation()}>
                            <uui-icon name="edit"></uui-icon>
                        </uui-button>
                        <uui-button pristine="" label="view" title="view"
                                    href="/umbraco/section/client-craft/workspace/accounts/view/${item.id}"
                                    @click=${(e: MouseEvent) => e.stopPropagation()}>
                            <uui-icon name="see"></uui-icon>
                        </uui-button>
                        <uui-button pristine="" label="delete" title="delete"
                                    @click=${(e: MouseEvent) => this._deleteAccountHandler(e, item.id?.toString() ?? '')}>
                            <uui-icon name="delete"></uui-icon>
                        </uui-button>
                    </uui-action-bar>
                </uui-table-cell>
            </uui-table-row>`;
    };

    render() {
        return html`
            <umb-workspace-editor
                    alias="ClientCraft.accounts.workspace.root"
                    .enforceNoFooter=${true}>
                <div slot="header"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: center">
                    <h3 id="headline">${this.localize.term('objects_accounts')}</h3>
                    <!-- TODO: try to find a better approach for route creation -->
                    <uui-button pristine="" href="/umbraco/section/client-craft/workspace/accounts/create" label="Create"
                                look="primary" style="--uui-button-height: min-content">
                        <uui-icon name="add"></uui-icon>
                        Create
                    </uui-button>
                </div>
                <div class="p-20">
                    <uui-box>
                        <div style="margin-bottom: 20px;">
                            Selected ${this._selection.length} of ${this._items.length}
                        </div>

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

                            ${repeat(this._items, item => item.id, this.renderRowTemplate)}
                        </uui-table>
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

export default RootObjectAccountsWorkspaceElement;

declare global {
    interface HtmlElementTagNameMap {
        'root-object-accounts-workspace': RootObjectAccountsWorkspaceElement
    }
}