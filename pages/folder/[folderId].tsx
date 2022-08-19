import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import {
    useAddDocumentMutation,
    useDeleteDocumentMutation,
    useGetDocumentsQuery,
    useRenameDocumentMutation
} from 'src/services/documents'
import {
    useDeleteFolderMutation,
    useGetFoldersQuery,
    useUpdateFolderMutation
} from 'src/services/folders'
import { useAppDispatch } from 'src/store'
import { setCurrentFolder } from 'src/store/navigation'
import styles from 'src/styles/Folder.module.css'
import { useUser, withPageAuth } from 'src/utils/supabase'

function DeleteFolderButton({ folderId }) {
    const [deleteFolder] = useDeleteFolderMutation()
    return (
        <button
            onClick={() => {
                deleteFolder({
                    id: folderId
                })
            }}
        >
            Supprimer
        </button>
    )
}

function RenameFolderButton({ folderId }) {
    const [updateFolder] = useUpdateFolderMutation()
    return (
        <button
            onClick={() => {
                const folderName = prompt("Nouveau nom:")
                if (!folderName) return
                updateFolder({
                    id: folderId,
                    update: { name: folderName }
                })
            }}
        >
            Renommer
        </button>
    )
}

function AddDocumentButton({ folderId }) {
    const [addDocument] = useAddDocumentMutation()

    return (
        <button
            onClick={() => {
                const title = prompt("Titre du document:")
                if (!title) return
                addDocument({ title, folderId })
            }}
        >
            Ajouter un document
        </button>
    )
}

function DeleteDocumentButton({ documentId }) {
    const [deleteDocument] = useDeleteDocumentMutation()

    return (
        <button
            onClick={() => {
                deleteDocument({ id: documentId })
            }}
        >
            Supprimer
        </button>
    )
}

function RenameDocumentButton({ documentId }) {
    const [renameDocument] = useRenameDocumentMutation()

    return (
        <button
            onClick={() => {
                const documentTitle = prompt("Titre du document:")
                if (!documentTitle) return

                renameDocument({ id: documentId, title: documentTitle })
            }}
        >
            Renommer
        </button>
    )
}

function Folder() {
    const { user } = useUser()
    const router = useRouter()
    const { folderId } = router.query as { folderId: string }
    const dispatch = useAppDispatch()

    const { folder, isFolderLoading } = useGetFoldersQuery(null, {
        selectFromResult: ({ data, isUninitialized, isLoading }) => ({
            folder: data?.find((f) => f.id === folderId),
            isFolderLoading: isUninitialized || isLoading
        }),
        skip: !user
    })

    const { documents } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            documents: data?.filter((d) => d.folder === folderId && !d.parent)
        }),
        skip: !user
    })

    useEffect(() => {
        dispatch(setCurrentFolder(folder))

        return () => {
            dispatch(setCurrentFolder(null))
        }
    }, [folder])

    return (
        <TransitionOpacity>
            <div className={styles.container}>
                {!!folder && (
                    <>
                        <h1 className={styles.folderTitle}>{folder.name}</h1>
                        <div className={styles.documentList}></div>
                        <RenameFolderButton folderId={folderId} />
                        <DeleteFolderButton folderId={folderId} />
                        <AddDocumentButton folderId={folderId} />

                        <ul>
                            {documents?.map((doc) => (
                                <li key={doc.id}>
                                    <Link href={`/doc/${doc.id}`}>
                                        <a>{doc.title}</a>
                                    </Link>
                                    <DeleteDocumentButton documentId={doc.id} />
                                    <RenameDocumentButton documentId={doc.id} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {!folder && !isFolderLoading && (
                    <span>
                        Désolé, ce dossier n&apos;existe pas. S&apos;il existait
                        avant, cela signifie qu&apos;il a été supprimé.
                    </span>
                )}
            </div>
        </TransitionOpacity>
    )
}

Folder.Layout = AppLayout
Folder.Title = "Dossier"

export const getServerSideProps = withPageAuth()

export default Folder
