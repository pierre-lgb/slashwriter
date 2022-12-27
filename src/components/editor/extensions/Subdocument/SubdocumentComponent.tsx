import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { MdOutlineInsertDriveFile as DocumentIcon } from "react-icons/md"
import Flex from "src/components/Flex"
import { useGetDocumentsQuery } from "src/services/documents"
import { supabaseClient, useUser } from "src/utils/supabase"
import styled from "styled-components"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

export default function Subdocument(props: NodeViewProps) {
    const { docId } = props.node.attrs
    const user = useUser()
    const [documentTitle, setDocumentTitle] = useState("")

    // Try to get the title from query cache
    const { document } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            document: data?.find((d) => d.id === docId)
        }),
        skip: !user
    })

    useEffect(() => {
        if (document) {
            // If document is already in cache
            setDocumentTitle(document.title || "Sans titre")
        } else {
            // Otherwise try to fetch it (for shared documents)
            supabaseClient
                .from("documents")
                .select("title")
                .match({ id: docId })
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        setDocumentTitle("(Document inexistant)")
                    } else {
                        setDocumentTitle(data.title || "Sans titre")
                    }
                })
        }
    }, [docId, document])

    const router = useRouter()

    return (
        <NodeViewWrapper
            className={props.selected ? "ProseMirror-selectednode" : ""}
        >
            <Link
                href={`${router.asPath.split(/\/[^/]*$/)[0]}/${docId}`}
                passHref
                legacyBehavior
            >
                <StyledLink as="a" align="center" gap={5}>
                    <DocumentIcon color="var(--color-n600)" fontSize="1.2rem" />
                    <div>
                        <DocumentTitle>{documentTitle}</DocumentTitle>
                    </div>
                </StyledLink>
            </Link>
        </NodeViewWrapper>
    )
}

const StyledLink = styled(Flex)`
    border-radius: 4px;

    &:hover {
        cursor: pointer;
        background-color: var(--color-n75);
    }
`

const DocumentTitle = styled.span`
    color: var(--color-n800);
    font-weight: 500;
    border-bottom: 1px solid #000;
    padding-bottom: 1px;
    line-height: auto;
    white-space: pre-wrap;
    text-overflow: ellipsis;
`
