import Link from 'next/link'
import { useRouter } from 'next/router'
import Flex from 'src/components/Flex'
import { useGetDocumentsQuery } from 'src/services/documents'
import { useUser } from 'src/utils/supabase'
import styled from 'styled-components'

import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import { NodeViewWrapper } from '@tiptap/react'

export default function Subdocument(props) {
    const { docId } = props.node.attrs
    const { user } = useUser()

    const { document } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            document: data?.find((d) => d.id === docId)
        }),
        skip: !user
    })

    const router = useRouter()
    return (
        <NodeViewWrapper
            className={props.selected ? "ProseMirror-selectednode" : ""}
        >
            <Link href={`/doc/${docId}`} passHref>
                <StyledLink as="a" align="center" gap={5}>
                    <DocumentIcon />
                    <div>
                        <DocumentTitle>
                            {document?.title || "Document sans titre"}
                        </DocumentTitle>
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

const DocumentIcon = styled(InsertDriveFileOutlined)`
    color: var(--color-n600);
    font-size: 1.2em;
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
