import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useMemo } from "react"
import {
    RiDeleteBin7Line as TrashIcon,
    RiEqualizerLine as SettingsIcon,
    RiFileList3Line as ChangelogIcon,
    RiFileTextLine as DocumentIcon,
    RiFolder2Line as FolderIcon,
    RiHome2Line as HomeIcon,
    RiQuestionLine as HelpIcon,
    RiShareForwardLine as ShareIcon
} from "react-icons/ri"
import Breadcrumbs from "src/components/ui/Breadcrumbs"
import Flex from "src/components/ui/Flex"
import { useAppSelector } from "src/store"

export default function HeaderBreadcrumbs(props) {
    const { activeDocument, activeFolder } = props
    const { docId, folderId } = useParams()
    const pathname = usePathname()

    const { documents } = useAppSelector((state) => state.documents)
    const { folders } = useAppSelector((state) => state.folders)

    const folderPath = useMemo(() => {
        if (!folderId) {
            return null
        }

        const path: any[] = []
        let current = folders.find((f) => f.id === folderId)

        while (current) {
            path.unshift(current)
            current = current.parent_id
                ? folders.find((f) => f.id === current?.parent_id)
                : undefined
        }

        return path
    }, [folderId, folders])

    const documentPath = useMemo(() => {
        if (!docId) {
            return null
        }

        const data = [
            ...documents.map((d) => ({ type: "document", ...d })),
            ...folders.map((f) => ({ type: "folder", ...f }))
        ] as any

        const path: any[] = []
        let current = data.find((item) => item.id === docId)

        while (current) {
            path.unshift(current)
            if (current.parent_id) {
                current = data.find((item) => item.id === current.parent_id)
            } else if (current.folder_id) {
                current = data.find((item) => item.id === current.folder_id)
            } else {
                current = null
            }
        }
        return path
    }, [docId, documents, folders])

    return (
        <Breadcrumbs maxItems={4} aria-label="breadcrumbs">
            {!!activeFolder &&
                folderPath?.map((folder, index) => (
                    <Link key={index} href={`/folder/${folder.id}`}>
                        <Flex
                            align="center"
                            gap={10}
                            style={{ padding: "0.2rem 0.4rem" }}
                        >
                            <FolderIcon />
                            <span>{folder.name.trim() || "Unnamed"}</span>
                        </Flex>
                    </Link>
                ))}

            {!!activeDocument &&
                documentPath?.map((item, index) => (
                    <Link
                        key={index}
                        href={`/${
                            item.type === "document" ? "doc" : "folder"
                        }/${item.id}`}
                    >
                        <Flex
                            align="center"
                            gap={10}
                            style={{ padding: "0.2rem 0.4rem" }}
                        >
                            {item.type === "folder" && (
                                <FolderIcon style={{ flexShrink: 0 }} />
                            )}
                            <span>
                                {(item.type === "document"
                                    ? item.title.trim()
                                    : item.name.trim()) || "Untitled"}
                            </span>
                        </Flex>
                    </Link>
                ))}
            {!activeDocument && !activeFolder && (
                <Flex align="center" gap={10}>
                    {pathname.endsWith("/home") ? (
                        <>
                            <HomeIcon />
                            Home
                        </>
                    ) : pathname.endsWith("/shares") ? (
                        <>
                            <ShareIcon />
                            Shares
                        </>
                    ) : pathname.endsWith("/trash") ? (
                        <>
                            <TrashIcon />
                            Trash
                        </>
                    ) : pathname.endsWith("/settings") ? (
                        <>
                            <SettingsIcon />
                            Settings
                        </>
                    ) : pathname.endsWith("/help") ? (
                        <>
                            <HelpIcon />
                            Help
                        </>
                    ) : pathname.endsWith("/changelog") ? (
                        <>
                            <ChangelogIcon />
                            Changelog
                        </>
                    ) : docId ? ( // For users viewing a shared document
                        <>
                            <DocumentIcon />
                            Document
                        </>
                    ) : null}
                </Flex>
            )}
        </Breadcrumbs>
    )
}
