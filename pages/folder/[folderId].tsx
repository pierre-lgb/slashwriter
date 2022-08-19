import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { useAddDocumentMutation, useGetDocumentsQuery } from 'src/services/documents'
import { useGetFoldersQuery } from 'src/services/folders'
import { useAppDispatch } from 'src/store'
import { setCurrentFolder } from 'src/store/navigation'
import styles from 'src/styles/Folder.module.css'
import { supabaseClient, useUser, withPageAuth } from 'src/utils/supabase'

import FolderOutlined from '@mui/icons-material/FolderOutlined'

function Folder() {
    const { user } = useUser()
    const router = useRouter()
    const { folderId } = router.query as { folderId: string }
    const dispatch = useAppDispatch()

    const [addDocument] = useAddDocumentMutation()
    const { folder } = useGetFoldersQuery(null, {
        selectFromResult: ({ data }) => ({
            folder: data?.find((f) => f.id === folderId)
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
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: 20
                    }}
                >
                    <FolderOutlined />
                    <h3 style={{ marginLeft: 10 }}>{folder?.name}</h3>
                </div>

                <button
                    onClick={() => {
                        const title = prompt("Titre du document:")
                        addDocument({ title, folderId })
                    }}
                >
                    Ajouter un document
                </button>
                <ul>
                    {documents?.map((doc) => (
                        <li key={doc.id}>
                            <Link href={`/doc/${doc.id}`}>
                                <a>{doc.title}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </TransitionOpacity>
    )
}

Folder.Layout = AppLayout
Folder.Title = "Dossier"

export const getServerSideProps = withPageAuth()

export default Folder
