import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { RiFileTextLine as DocumentIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"
import { supabaseClient, useUser } from "src/utils/supabase"

const DocumentEditor = dynamic(() => import("src/components/editor"), {
    ssr: false,
    loading: () => (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Loader size="large" />
        </div>
    )
})

function Document() {
    const user = useUser()
    const router = useRouter()
    const { docId } = router.query as { docId: string }

    const { document, isLoadingDocument } = useAppSelector((state) => ({
        document: state.documents.documents.find((d) => d.id === docId),
        isLoadingDocument: state.documents.isLoading
    }))

    const [permission, setPermission] = useState("loading")

    useEffect(() => {
        if (docId && !isLoadingDocument) {
            if (document) {
                setPermission("edit")
            } else {
                supabaseClient
                    .rpc("get_user_permission_for_document", {
                        document_id: docId,
                        user_id: user?.id || null,
                        document: null
                    })
                    .single()
                    .then(({ data }) => setPermission(data))
            }
        }

        return () => {
            setPermission("loading")
        }
    }, [docId, document, isLoadingDocument, user?.id])

    return (
        <TransitionOpacity>
            {["read", "edit"].includes(permission) ? (
                <DocumentEditor
                    documentId={docId}
                    user={{ email: user?.email }}
                    editable={permission === "edit"}
                />
            ) : (
                <Flex
                    align="center"
                    justify="center"
                    style={{ width: "100%", height: "100%" }}
                >
                    {permission === "loading" ? (
                        <Loader size="large" />
                    ) : (
                        <Typography.Text>
                            {"Vous n'avez pas accès à ce document."}
                        </Typography.Text>
                    )}
                </Flex>
            )}
        </TransitionOpacity>
    )
}

Document.Layout = AppLayout
Document.Title = "Document"
Document.Icon = <DocumentIcon />

export default Document
