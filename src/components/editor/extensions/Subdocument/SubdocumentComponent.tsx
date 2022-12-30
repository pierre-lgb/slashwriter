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
            <Link href={`${router.asPath.split(/\/[^/]*$/)[0]}/${docId}`}>
                <Container>
                    <DocumentIcon />
                    <Flex
                        auto
                        column
                        justify="center"
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {loading ? (
                            <Loader />
                        ) : document ? (
                            <>
                                <DocumentTitle>{document.title}</DocumentTitle>
                                <DocumentMeta>
                                    Modifié le{" "}
                                    {moment(
                                        new Date(document.updated_at)
                                    ).format("DD/MM/YYYY")}{" "}
                                    à{" "}
                                    {moment(
                                        new Date(document.updated_at)
                                    ).format("HH:mm")}
                                </DocumentMeta>
                            </>
                        ) : (
                            <>
                                <DocumentTitle>
                                    Document introuvable
                                </DocumentTitle>
                                <DocumentMeta>
                                    {
                                        "Vous n'avez pas accès à ce document, ou alors il a été supprimé."
                                    }
                                </DocumentMeta>
                            </>
                        )}
                    </Flex>
                </Container>
            </Link>
        </NodeViewWrapper>
    )
}

const Container = styled.div`
    display: flex;
    border-radius: 5px;
    gap: 0.5rem;
    padding: 5px;
    cursor: pointer;

    &:hover {
        background-color: var(--color-n75);
    }
`
const DocumentIcon = styled.div`
    width: 38px;
    height: 53px;
    border: 1px solid var(--color-n300);
    border-radius: 4px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgb(200,200,200)' width='25' height='38'%3E%3Cg%3E%3Crect width='25' height='2' y='0'/%3E%3Crect width='25' height='2' y='4'/%3E%3Crect width='15' height='2' y='8'/%3E%3Crect width='30' height='2' y='14'/%3E%3Crect width='20' height='2' y='18'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center center;
    flex-shrink: 0;
`

const DocumentTitle = styled.span`
    color: var(--color-n800);
    font-weight: 500;
    max-width: 80%;
    padding-bottom: 1px;
    line-height: 1;
    text-overflow: ellipsis;
    overflow: hidden;
`

const DocumentMeta = styled.span`
    font-size: 0.9em;
    color: var(--color-n600);
    text-overflow: ellipsis;
    overflow: hidden;
`
