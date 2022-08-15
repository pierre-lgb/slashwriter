import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Folder.module.css'
import { supabaseClient, useUser, withPageAuth } from 'src/utils/supabase'

import FolderOutlined from '@mui/icons-material/FolderOutlined'

function Folder() {
    const { user } = useUser()
    const router = useRouter()
    const { folderId } = router.query
    const [folder, setFolder] = useState(null)
    const [documents, setDocuments] = useState([])

    const getFolder = async () => {
        console.log("Fetch folder details", folderId)
        const { data: folder, error } = await supabaseClient
            .from("folders")
            .select("name")
            .eq("id", folderId)
            .single()

        if (folder) {
            setFolder(folder)
        } else {
            console.error(error)
            alert(error.message)
        }
    }

    const getDocuments = async () => {
        console.log("Fetching documents for folder", folderId)
        const { data: documents, error } = await supabaseClient
            .from("documents")
            .select("id, title, text")
            .eq("folder", folderId)

        if (documents) {
            setDocuments(documents)
        } else {
            console.error(error)
            alert(error.message)
        }
    }

    const addDocument = async (title) => {
        console.log("Adding document", title)
        const { data, error } = await supabaseClient.from("documents").insert({
            title,
            folder: folderId
        })

        if (data) {
            setDocuments((prev) => [...prev, ...data])
        } else {
            console.error(error)
            alert(error.message)
        }
    }

    useEffect(() => {
        // TODO : Fetch from getStaticProps or getServerSideProps instead
        // Must be authenticated in order to perform theses requests
        if (user) {
            getFolder()
            getDocuments()
        }
    }, [user, folderId])

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
                        addDocument(title)
                    }}
                >
                    Ajouter un document
                </button>
                <ul>
                    {documents.map((doc) => (
                        <li key={doc.id}>
                            <Link href={`/doc/${doc.id}`}>
                                <a>
                                    {doc.title} | {doc.text || "Document vide"}
                                </a>
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
