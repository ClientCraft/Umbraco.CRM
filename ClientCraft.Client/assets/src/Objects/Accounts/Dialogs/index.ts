import { ManifestModal } from '@umbraco-cms/backoffice/modal';
import { deleteAccountDialog } from './DeleteAccountDialog/manifest.ts';


export const accountDialogs: ManifestModal[] = [
    ...deleteAccountDialog
]