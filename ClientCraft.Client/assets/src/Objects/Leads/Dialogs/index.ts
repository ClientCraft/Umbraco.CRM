import {deleteLeadDialog} from "./DeleteLeadDialog/manifest.ts";
import {convertLeadDialog} from "./ConvertLeadDialog/manifest.ts";
import { ManifestModal } from "@umbraco-cms/backoffice/modal";

export const dialogs: ManifestModal[] = [
    ...deleteLeadDialog,
    ...convertLeadDialog
]