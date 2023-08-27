"use client"

import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Flex from "src/components/ui/Flex"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"

import styles from "./Document.module.scss"

const SlashwriterEditor = dynamic(() => import("src/components/editor"), {
    ssr: false,
    loading: () => (
        <div className={styles.loaderContainer}>
            <Loader size="large" />
        </div>
    )
})

export default function Document() {
    const { session, supabaseClient } = useSupabase()

    const { docId } = useParams()

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
                        user_id: session?.user.id || null,
                        document: null
                    })
                    .single()
                    .then(({ data }) => setPermission(data as string))
            }
        }

        return () => {
            setPermission("loading")
        }
    }, [docId, document, isLoadingDocument, session?.user.id])

    return ["read", "edit"].includes(permission) ? (
        <SlashwriterEditor
            documentId={docId as string}
            user={{ email: session?.user.email }}
            token={
                session
                    ? JSON.stringify({
                          access_token: session.access_token,
                          refresh_token: session.refresh_token
                      })
                    : "anonymous"
            }
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
                    You do not have access to this document.
                </Typography.Text>
            )}
        </Flex>
    )
}
