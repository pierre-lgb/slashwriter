import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { RiFileTextLine as DocumentIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useGetDocumentsQuery } from "src/services/documents"
import { useGetFoldersQuery } from "src/services/folders"
import { useAppDispatch } from "src/store"
import { setActiveDocumentId, setActiveFolderId } from "src/store/navigation"
import { supabaseClient, useUser } from "src/utils/supabase"

const DocumentEditor = dynamic(() => import("src/components/editor"), {
    ssr: false
})

function Document() {
    const router = useRouter()
    const { docId } = router.query as { docId: string }
    const user = useUser()

    const [permission, setPermission] = useState("loading")

    const { document } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            document: data?.find((d) => d.id === docId)
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
        dispatch(setActiveDocumentId(document?.id))
        dispatch(setActiveFolderId(folder?.id))

        return () => {
            dispatch(setActiveDocumentId(null))
            dispatch(setActiveFolderId(null))
        }
    }, [document, folder, dispatch])

    useEffect(() => {
        const getSharedDocumentPermission = async () => {
            let permission = "none"

            const { error: canReadError } = await supabaseClient.rpc(
                "canreaddocument",
                {
                    user_id: user?.id || null,
                    document_id: docId
                }
            )

            if (canReadError) {
                return permission
            }

            permission = "read"

            const { error: canEditError } = await supabaseClient.rpc(
                "caneditdocument",
                {
                    user_id: user?.id || null,
                    document_id: docId
                }
            )

            if (canEditError) {
                return permission
            }

            permission = "read|edit"
            return permission
        }

        if (docId) {
            if (document) {
                setPermission("read|edit")
            } else {
                getSharedDocumentPermission().then((permission) => {
                    setPermission(permission)
                })
            }
        }

        return () => {
            setPermission("loading")
        }
    }, [docId, user?.id])

    return (
        <TransitionOpacity>
            {permission.includes("read") ? (
                <DocumentEditor
                    documentId={docId}
                    user={{ email: user?.email }}
                    editable={!!permission.includes("edit")}
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
