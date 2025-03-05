import { ManifestModal } from '@umbraco-cms/backoffice/modal';
import { deleteDealDialog } from './DeleteDealDialog/manifest.ts';
import { createDealDialog } from "./CreateDealDialog/manifest.ts";

export const dealDialogs: ManifestModal[] = [
    ...deleteDealDialog,
    ...createDealDialog
]