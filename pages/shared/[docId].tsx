import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DocumentEditor from "src/components/editor"
import Flex from "src/components/Flex"
import TransitionOpacity from "src/components/TransitionOpacity"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useGetDocumentsQuery } from "src/services/documents"
import { useAppDispatch } from "src/store"
import { setActiveDocument } from "src/store/navigation"
import { supabaseClient, useUser } from "src/utils/supabase"

function getRandomName() {
    const NAMES = ["Anonymous", "Toad", "Yoshi", "Luma", "Boo"]
    return NAMES[Math.round(Math.random() * (NAMES.length - 1))]
}

function Shared() {
    const router = useRouter()
    const { docId } = router.query as { docId: string }
    const user = useUser()
    const [permission, setPermission] = useState<string>("none")
    const [loadingPermission, setLoadingPermission] = useState<boolean>(true)

    // Tries to find document in cache
    const { document: cacheDocument } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            document: data?.find((d) => d.id === docId)
        }),
        skip: !user
    })

    useEffect(() => {
        // If document is in cache, it means the current user
        // is its owner, in which case this is the wrong route.
        if (cacheDocument) {
            router.push(router.asPath.replace("shared", "doc"))
        }
    }, [docId, cacheDocument, router])

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setActiveDocument(docId))

        return () => {
            dispatch(setActiveDocument(null))
        }
    }, [docId, dispatch])

    async function getPermission() {
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

    useEffect(() => {
        if (docId) {
            getPermission().then((permission) => {
                setPermission(permission)
                setLoadingPermission(false)
            })
        }

        return () => {
            setPermission("none")
            setLoadingPermission(true)
        }
    }, [docId])

    return (
        <TransitionOpacity>
            {!loadingPermission && permission.includes("read") ? (
                <DocumentEditor
                    documentId={docId}
                    user={{
                        email: user?.email || getRandomName()
                    }}
                    editable={!!permission.includes("edit")}
                />
            ) : (
                <Flex
                    align="center"
                    justify="center"
                    style={{ height: "100vh" }}
                >
                    {loadingPermission || cacheDocument ? (
                        <Loader />
                    ) : (
                        <Typography.Text align="center">
                            Vous n&apos;avez pas accès à ce document. Il a
                            peut-être été supprimé.
                        </Typography.Text>
                    )}
                </Flex>
            )}
        </TransitionOpacity>
    )
}

Shared.Title = "Document partagé"

export default Shared
