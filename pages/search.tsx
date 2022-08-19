import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import {
    useAddFolderMutation,
    useDeleteFolderMutation,
    useGetFoldersQuery,
    useUpdateFolderMutation
} from 'src/services/folders'
import styles from 'src/styles/Search.module.css'
import { useUser, withPageAuth } from 'src/utils/supabase'

const FolderList = (props) => {
    const { user } = useUser()
    const { data, error, isLoading } = useGetFoldersQuery(null, {
        skip: !user
    })
    const [addFolder] = useAddFolderMutation()
    const [updateFolder] = useUpdateFolderMutation()
    const [deleteFolder] = useDeleteFolderMutation()

    return (
        <div>
            <button
                onClick={() => {
                    const folderId = prompt("Folder ID:")
                    const folderName = prompt("Folder name:")

                    updateFolder({ id: folderId, update: { name: folderName } })
                }}
            >
                Rename folder
            </button>

            <button
                onClick={() => {
                    const folderId = prompt("Folder ID:")
                    deleteFolder({ id: folderId })
                }}
            >
                Delete folder
            </button>
            <button
                onClick={() => {
                    const folderName = prompt("Folder name:")
                    addFolder({ name: folderName })
                }}
            >
                Add folder
            </button>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

function Search() {
    return (
        <TransitionOpacity>
            <FolderList />
            <div className={styles.container}>Search</div>
        </TransitionOpacity>
    )
}

Search.Layout = AppLayout
Search.Title = "Rechercher"

export const getServerSideProps = withPageAuth()

export default Search
