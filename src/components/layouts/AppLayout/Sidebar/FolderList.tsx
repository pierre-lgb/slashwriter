import { useGetDocumentsQuery } from 'src/services/documents'
import { useAddFolderMutation, useGetFoldersQuery } from 'src/services/folders'
import { useAppSelector } from 'src/store'
import { useUser } from 'src/utils/supabase'

import AddOutlined from '@mui/icons-material/AddOutlined'
import FolderOutlined from '@mui/icons-material/FolderOutlined'

import SidebarButton from './SidebarButton'
import SidebarLink from './SidebarLink'

export default function FolderList() {
    const { user } = useUser()

    const { currentFolder } = useAppSelector((store) => store.navigation)

    const [addFolder] = useAddFolderMutation()
    const {
        data: folders,
        error: foldersError,
        isLoading: isLoadingFolders
    } = useGetFoldersQuery(null, {
        // It won't work if the realtime subscription is initialized
        // when user is null, so we skip the query until we have the user
        skip: !user
    })

    const {
        data: documents,
        error: documentsError,
        isLoading: isLoadingDocuments
    } = useGetDocumentsQuery(null, {
        skip: !user
    })

    return isLoadingFolders || isLoadingDocuments ? (
        <strong>Chargement...</strong>
    ) : (
        <>
            {folders?.map(({ id, color, name }) => (
                // TODO : Folders dropdown documents
                <SidebarLink
                    key={id}
                    href={`/folder/${id}`}
                    icon={<FolderOutlined sx={{ color }} />}
                    label={name}
                    active={id === currentFolder?.id}
                />
            ))}
            <SidebarButton
                label="Nouveau dossier"
                icon={<AddOutlined />}
                action={() => {
                    const folderName = prompt("Nom du dossier :")
                    addFolder({ name: folderName })
                }}
            />
        </>
    )
}
