import moment from "moment"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import * as documentsApi from "src/api/documents"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import { useAppDispatch, useAppSelector } from "src/store"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import DocumentLink from "../DocumentLink"

export default function SubdocumentComponent(props: NodeViewProps) {
    const { docId } = props.node.attrs

    const [document, setDocument] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const dispatch = useAppDispatch()

    const router = useRouter()
    const { docId: parentDocId } = useParams()
    const pathname = usePathname()

    const { supabaseClient } = useSupabase()

    useEffect(() => {
        if (docId === "create_new") {
            dispatch(
                documentsApi.insertDocument({ parent_id: parentDocId })
            ).then((res: any) => {
                if (res.payload) {
                    props.updateAttributes({ docId: res.payload.id })
                    router.push(`/doc/${res.payload.id}`)
                    return
                }

                alert("Impossible de créer le document intégré")
                props.deleteNode()
            })
        }
    }, [docId])

    // Try to get the title from query cache
    const { cacheDocument } = useAppSelector((state) => ({
        cacheDocument: state.documents.documents.find((d) => d.id === docId)
    }))

    useEffect(() => {
        if (cacheDocument) {
            // If document is already in cache
            setDocument({
                title: cacheDocument.title || "Sans titre",
                updated_at: cacheDocument.updated_at
            })
            setLoading(false)
        } else if (docId !== "create_new") {
            // Otherwise try to fetch it (for shared documents)
            supabaseClient
                .from("documents")
                .select("title, updated_at")
                .match({ id: docId })
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        setDocument(null)
                    } else {
                        setDocument({
                            title: data.title || "Sans titre",
                            updated_at: data.updated_at
                        })
                    }
                    setLoading(false)
                })
        }
    }, [docId, cacheDocument])

    return (
        <NodeViewWrapper
            className={props.selected ? "ProseMirror-selectednode" : ""}
        >
            <DocumentLink
                href={`${pathname.split(/\/[^/]*$/)[0]}/${docId}`}
                title={document?.title || "Document introuvable"}
                status={
                    document
                        ? `Modifié le ${moment(
                              new Date(document.updated_at)
                          ).format("DD/MM/YYYY")} à ${moment(
                              new Date(document.updated_at)
                          ).format("HH:mm")}`
                        : "Vous n'avez pas accès à ce document, ou alors il a été supprimé."
                }
                loading={loading}
            />
        </NodeViewWrapper>
    )
}
