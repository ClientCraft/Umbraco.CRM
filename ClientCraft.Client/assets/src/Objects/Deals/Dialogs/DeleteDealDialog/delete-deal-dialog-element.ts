// @ts-nocheck
import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {DeleteDealDialogValue, DeleteDealDialogData} from "./delete-deal-dialog-token.ts";
import UmbObjectDealsWorkspaceContext from "../../Context/object-deals-workspace.context.ts";
import {CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN} from "../../Context";

@customElement('delete-deals-modal')
export class DeleteLeadsModal extends
    UmbModalBaseElement<DeleteDealDialogData, DeleteDealDialogValue>
{
    private _dealsContext: UmbObjectDealsWorkspaceContext | undefined;
    private _deletingDeal: boolean = false;
    constructor() {
        super();

        this.consumeContext(CLIENTCRAFT_OBJECT_DEALS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._dealsContext = _instance;
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
            this._deletingDeal = true;

            const deleteResult = await this._dealsContext?.service.deals.deleteDeal(parseInt(this.data?.deleteItemId));
            console.log(deleteResult);
            this._deletingDeal = false;
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
                            .state="${this._deletingDeal ? 'waiting' : null}"
                            @click=${this.#handleDelete}></uui-button>
            </div>
            </umb-body-layout>
        `;
    }

}

export default DeleteLeadsModal;