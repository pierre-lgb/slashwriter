import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Document.module.css'
import { supabaseClient, useUser, withPageAuth } from 'src/utils/supabase'

const DocumentEditor = dynamic(() => import("src/components/editor"), {
    ssr: false
})

function Document() {
    const { user } = useUser()
    const router = useRouter()
    const { docId } = router.query

    const [document, setDocument] = useState(null)
    const getDocument = async () => {
        console.log("Fetch document details", docId)
        const { data: document, error } = await supabaseClient
            .from("documents")
            .select("title, folder(name)")
            .eq("id", docId)
            .single()

        if (document) {
            setDocument(document)
        } else {
            console.error(error)
            alert(error.message)
        }
    }

    useEffect(() => {
        // TODO : Fetch from getStaticProps or getServerSideProps instead
        // Must be authenticated in order to perform theses requests
        if (user) {
            getDocument()
        }
    }, [user, docId])

    return (
        <TransitionOpacity>
            <div className={styles.container}>
                <div>
                    <DocumentEditor documentId={docId} />
                </div>
            </div>
        </TransitionOpacity>
    )
}

Document.Layout = AppLayout
Document.Title = "Document"

export const getServerSideProps = withPageAuth()

export default Document
