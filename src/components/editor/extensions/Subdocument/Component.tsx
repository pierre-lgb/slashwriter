import Link from 'next/link'
import { useRouter } from 'next/router'
import { useDeleteDocumentMutation, useGetDocumentsQuery } from 'src/services/documents'
import { useAppDispatch } from 'src/store'
import { useUser } from 'src/utils/supabase'

import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import { NodeViewWrapper } from '@tiptap/react'

import styles from './Subdocument.module.css'

export default function Subdocument(props) {
    const { docId } = props.node.attrs
    const { user } = useUser()

    // const [deleteDocument] = useDeleteDocumentMutation()
    const { document } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            document: data?.find((d) => d.id === docId)
        }),
        skip: !user
    })

    const router = useRouter()
    return (
        <NodeViewWrapper
            className={[
                styles.subdocument,
                props.selected ? "ProseMirror-selectednode" : ""
            ].join(" ")}
        >
            <Link href={`/doc/${docId}`}>
                <a style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span className={styles.icon}>
                            <InsertDriveFileOutlined />
                        </span>
                        <span className={styles.title}>
                            {document?.title || "Document sans titre"}
                        </span>
                    </div>
                    <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                            e.preventDefault()
                            props.deleteNode()
                        }}
                    >
                        <DeleteOutlined fontSize="small" />
                    </button>
                </a>
            </Link>
        </NodeViewWrapper>
    )
}
