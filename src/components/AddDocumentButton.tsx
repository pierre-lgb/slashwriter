import { useRouter } from "next/router"
import { ReactNode } from "react"
import { RiAddLine as AddIcon } from "react-icons/ri"
import { useAddDocumentMutation } from "src/services/documents"

import Button from "./ui/Button"

interface AddDocumentButtonProps {
    /**
     * The folder to add a document in.
     */
    folderId: string
    children?: ReactNode
    [key: string]: any
}

export default function AddDocumentButton(props: AddDocumentButtonProps) {
    const router = useRouter()
    const { folderId, children, ...rest } = props
    const [addDocument] = useAddDocumentMutation()

    return (
        <Button
            icon={<AddIcon />}
            appearance="secondary"
            onClick={async () => {
                const { data, error }: { data?: any; error?: any } =
                    await addDocument({
                        folderId: folderId
                    })

                if (data) {
                    router.push(`/doc/${data[0].id}`)
                } else {
                    alert("Une erreur est survenue.")
                    console.error(error)
                }
            }}
            {...rest}
        >
            {children}
        </Button>
    )
}
