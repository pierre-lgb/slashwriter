import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import Flex from "src/components/Flex"
import TransitionOpacity from "src/components/TransitionOpacity"
import { useGetDocumentsQuery } from "src/services/documents"
import { supabaseClient, useUser } from "src/utils/supabase"

const DocumentEditor = dynamic(() => import("src/components/editor"), {
    ssr: false
})

function getRandomName() {
    const NAMES = ["Anonymous", "Toad", "Yoshi", "Luma", "Boo"]
    return NAMES[Math.round(Math.random() * (NAMES.length - 1))]
}

function Shared() {
    const router = useRouter()
    const { docId } = router.query as { docId: string }
    const { user, isLoading: authLoading } = useUser()
    const [isAnonymous, setAnonymous] = useState<boolean>(false)
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
    }, [docId, cacheDocument])

    useEffect(() => {
        if ((user || isAnonymous) && loadingPermission) {
            supabaseClient
                .from("documents")
                .select("share_settings")
                .match({ id: docId })
                .single()
                .then(async ({ data: document }) => {
                    const params = {
                        share_id: document?.share_settings,
                        user_id: user?.id || null
                    }

                    if (document) {
                        setPermission("read")
                    }

                    await supabaseClient
                        .rpc("canedit", params)
                        .then(({ data: canEdit }) => {
                            if (canEdit) {
                                setPermission("read|edit")
                            }
                        })
                })
                .then(() => {
                    setLoadingPermission(false)
                })
        }
    }, [docId, user, isAnonymous])

    useEffect(() => {
        if (!user && !authLoading) {
            setAnonymous(true)
        }
    }, [user, authLoading])

    return (
        <TransitionOpacity>
            {!loadingPermission && permission.includes("read") ? (
                <DocumentEditor
                    documentId={docId}
                    user={{
                        email: isAnonymous ? getRandomName() : user.email
                    }}
                    editable={!!permission.includes("edit")}
                />
            ) : (
                <Flex
                    align="center"
                    justify="center"
                    style={{ width: "100%", height: "100%" }}
                >
                    {loadingPermission ? (
                        <span>Chargement...</span>
                    ) : cacheDocument ? (
                        <span>Redirection...</span>
                    ) : (
                        <span>
                            Vous n&apos;avez pas accès à ce document. Il a
                            peut-être été supprimé.
                        </span>
                    )}
                </Flex>
            )}
        </TransitionOpacity>
    )
}

Shared.Title = "Document partagé"

export default Shared
