import { useRouter } from "next/router"
import { ReactNode } from "react"
import { RiAddLine as AddIcon } from "react-icons/ri"
import { documentsApi } from "src/api"
import { useAppDispatch } from "src/store"

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
    const dispatch = useAppDispatch()

    return (
        <Button
            icon={<AddIcon />}
            appearance="secondary"
            onClick={async () => {
                const res = (await dispatch(
                    documentsApi.insertDocument({ folder_id: folderId })
                )) as any

                if (res.payload) {
                    router.push(`/doc/${res.payload.id}`)
                }
            }}
            {...rest}
        >
            {children}
        </Button>
    )
}
