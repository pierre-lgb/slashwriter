import { useRouter } from "next/router"
import { useAddDocumentMutation } from "src/services/documents"

import AddOutlined from "@mui/icons-material/AddOutlined"

import Button from "./ui/Button"

interface AddDocumentButtonProps {
    /**
     * The folder to add a document in.
     */
    folderId: string
    [key: string]: any
}

export default function AddDocumentButton(props: AddDocumentButtonProps) {
    const router = useRouter()
    const { folderId, ...rest } = props
    const [addDocument] = useAddDocumentMutation()

    return (
        <Button
            icon={<AddOutlined />}
            appearance="secondary"
            onClick={() => {
                const title = prompt("Nouveau document:")
                if (!title) return
                addDocument({
                    title,
                    folderId: folderId
                }).then((res) => {
                    // Redirecting
                    const { data } = res as { data?: any; error?: any }
                    if (data[0]) router.push(`/doc/${data[0].id}`)
                })
            }}
            {...rest}
        >
            Nouveau
        </Button>
    )
}
