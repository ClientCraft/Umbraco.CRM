import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {DeleteAccountDialogValue, DeleteAccountDialogData} from "./delete-account-dialog-token.ts";
import UmbObjectAccountsWorkspaceContext from "../../Context/object-accounts-workspace.context.ts";
import {CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN} from "../../Context";

@customElement('delete-accounts-modal')
export class DeleteAccountsModal extends
    UmbModalBaseElement<DeleteAccountDialogData, DeleteAccountDialogValue>
{
    private _accountsContext: UmbObjectAccountsWorkspaceContext | undefined;
    private _deletingAccount: boolean = false;
    constructor() {
        super();

        this.consumeContext(CLIENTCRAFT_OBJECT_ACCOUNTS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._accountsContext = _instance;
        });
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    async #handleDelete(e: SubmitEvent) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        this.value = { delete: true};

        if (this.data?.deleteItemId) {
            this._deletingAccount = true;

            // @ts-ignore
            const deleteResult = await this._accountsContext?.service.deleteAccount(parseInt(this.data?.deleteItemId));
            console.log(deleteResult);
            this._deletingAccount = false;
        }
        this.modalContext?.submit();
    }

    #handleCancel() {
        this.value = { delete: false };
        this.modalContext?.submit();
    }

    render() {
        return html`
            <umb-body-layout .headline=${this.data?.headline ?? 'Custom dialog'}>
               <p>Are you sure you want to delete this item? This action is irreversible.</p>

                <div slot="actions">
                        <uui-button id="cancel" label="Cancel" @click="${this.#handleCancel}">Cancel</uui-button>
                        <uui-button
                            id="submit"
                            color='danger'
                            look="primary"
                            label="Delete"
                            .state="${this._deletingAccount ? 'waiting' : null}"
                            @click=${this.#handleDelete}></uui-button>
            </div>
            </umb-body-layout>
        `;
    }

}

export default DeleteAccountsModal;