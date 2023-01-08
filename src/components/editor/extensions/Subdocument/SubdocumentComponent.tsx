import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Flex from "src/components/Flex"
import Loader from "src/components/ui/Loader"
import { useGetDocumentsQuery } from "src/services/documents"
import { supabaseClient, useUser } from "src/utils/supabase"
import styled from "styled-components"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import DocumentLink from "../../components/DocumentLink"

export default function SubdocumentComponent(props: NodeViewProps) {
    const { docId } = props.node.attrs
    const [document, setDocument] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Try to get the title from query cache
    const { document: cacheDocument } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            document: data?.find((d) => d.id === docId)
        })
    })

    useEffect(() => {
        if (cacheDocument) {
            // If document is already in cache
            setDocument({
                title: cacheDocument.title || "Sans titre",
                updated_at: cacheDocument.updated_at
            })
            setLoading(false)
        } else {
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

    const router = useRouter()

    return (
        <NodeViewWrapper
            className={props.selected ? "ProseMirror-selectednode" : ""}
        >
            <DocumentLink
                href={`${router.asPath.split(/\/[^/]*$/)[0]}/${docId}`}
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
