// @ts-nocheck
import { customElement, html } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import {DeleteContactDialogValue, DeleteContactDialogData} from "./delete-contact-dialog-token.ts";
import {CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN, UmbObjectContactsWorkspaceContext} from "../../Context";

@customElement('delete-contacts-modal')
export class DeleteLeadsModal extends
    UmbModalBaseElement<DeleteContactDialogData, DeleteContactDialogValue>
{
    private _contactsContext: UmbObjectContactsWorkspaceContext | undefined;
    private _deletingContact: boolean = false;
    constructor() {
        super();

        this.consumeContext(CLIENTCRAFT_OBJECT_CONTACTS_WORKSPACE_CONTEXT_TOKEN, (_instance) => {
            this._contactsContext = _instance;
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
            this._deletingContact = true;

            const deleteResult = await this._contactsContext?.service.deleteContact(parseInt(this.data?.deleteItemId));
            console.log(deleteResult);
            this._deletingContact = false;
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
                            .state="${this._deletingContact ? 'waiting' : null}"
                            @click=${this.#handleDelete}></uui-button>
            </div>
            </umb-body-layout>
        `;
    }

}

export default DeleteLeadsModal;