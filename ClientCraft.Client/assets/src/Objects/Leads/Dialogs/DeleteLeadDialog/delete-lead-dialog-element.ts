// @ts-nocheck
import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {DeleteLeadDialogData, DeleteLeadDialogValue} from "./delete-lead-dialog-token.ts";
import { CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN } from "../../Context";
import UmbObjectLeadsWorkspaceContext from "../../Context/object-leads-workspace.context.ts";

@customElement('delete-leads-modal')
export class DeleteLeadsModal extends
    UmbModalBaseElement<DeleteLeadDialogData, DeleteLeadDialogValue>
{
    private _leadsContext: UmbObjectLeadsWorkspaceContext;
    private _deletingLead: boolean = false;
    constructor() {
        super();

        this.consumeContext(CLIENTCRAFT_OBJECT_LEADS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._leadsContext = _instance;
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
            this._deletingLead = true;

            const deleteResult = await this._leadsContext?.service.leads.deleteLead(parseInt(this.data?.deleteItemId));
            console.log(deleteResult);
            this._deletingLead = false;
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
                            .state="${this._deletingLead ? 'waiting' : null}"
                            @click=${this.#handleDelete}></uui-button>
            </div>
            </umb-body-layout>
        `;
    }

}

export default DeleteLeadsModal;