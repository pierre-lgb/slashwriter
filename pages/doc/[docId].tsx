import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { useGetDocumentsQuery } from 'src/services/documents'
import { useGetFoldersQuery } from 'src/services/folders'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setCurrentDocument, setCurrentFolder } from 'src/store/navigation'
import styles from 'src/styles/Document.module.css'
import { supabaseClient, useUser, withPageAuth } from 'src/utils/supabase'

const DocumentEditor = dynamic(() => import("src/components/editor"), {
    ssr: false
})

function Document() {
    const router = useRouter()
    const { docId } = router.query
    const { user } = useUser()

    const { document, isDocumentLoading } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data, isLoading, isUninitialized }) => ({
            document: data?.find((d) => d.id === docId),
            isDocumentLoading: isUninitialized || isLoading
        }),
        skip: !user
    })

    const { folder } = useGetFoldersQuery(null, {
        selectFromResult: ({ data }) => ({
            folder: data?.find((f) => f.id === document?.folder)
        }),
        skip: !user
    })

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setCurrentDocument(document))
        dispatch(setCurrentFolder(folder))

        return () => {
            dispatch(setCurrentDocument(null))
            dispatch(setCurrentFolder(null))
        }
    }, [document, folder])

    return (
        <TransitionOpacity>
            <div className={styles.container}>
                <div>
                    {!!document && !!user && (
                        <>
                            <DocumentEditor
                                documentId={docId}
                                user={{ email: user.email }}
                            />
                        </>
                    )}
                    {!document && !isDocumentLoading && (
                        <span>
                            Désolé, ce document n&apos;existe pas. S&apos;il
                            existait avant, cela signifie qu&apos;il a été
                            supprimé.
                        </span>
                    )}
                </div>
            </div>
        </TransitionOpacity>
    )
}

Document.Layout = AppLayout
Document.Title = "Document"

export const getServerSideProps = withPageAuth()

export default Document
