import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useMemo } from "react"
import {
    RiFolder2Line as FolderIcon,
    RiHeartFill as FavoriteFillIcon,
    RiHeartLine as FavoriteIcon,
    RiMoreFill as MoreIcon,
    RiSideBarLine as SidebarIcon,
    RiUserLine as UserIcon
} from "react-icons/ri"
import * as documentsApi from "src/api/documents"
import Flex from "src/components/Flex"
import ShareDocumentButton from "src/components/ShareDocumentButton"
import Breadcrumbs from "src/components/ui/Breadcrumbs"
import Button from "src/components/ui/Button"
import { useAppDispatch, useAppSelector } from "src/store"
import { toggleMobileSidebar, toggleSidebar } from "src/store/ui"
import { useUser } from "src/utils/supabase"
import styled from "styled-components"

interface HeaderProps {
    pageTitle: string
    pageIcon: ReactNode
}

export default function Header({ pageTitle, pageIcon }: HeaderProps) {
    const user = useUser()
    const dispatch = useAppDispatch()
    const router = useRouter()

    const { sidebarOpen, mobileSidebarOpen } = useAppSelector(
        (state) => state.ui
    )

    const { docId, folderId } = router.query as Record<string, any>
    const { documents } = useAppSelector((state) => state.documents)
    const { folders } = useAppSelector((state) => state.folders)

    const activeDocument = useAppSelector((state) =>
        docId ? state.documents.documents.find((d) => d.id === docId) : null
    )

    const activeFolder = useAppSelector((state) =>
        folderId
            ? state.folders.folders.find((f) => f.id === folderId)
            : docId
            ? state.documents.documents.find((d) => d.id === docId)?.folder_id
            : null
    )

    const folderPath = useMemo(() => {
        if (!folderId) {
            return null
        }

        const path = []
        let current = folders.find((f) => f.id === folderId)

        while (current) {
            path.unshift(current)
            current = current.parent_id
                ? folders.find((f) => f.id === current.parent_id)
                : null
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

        const path = []
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
        <Container className="header">
            <Flex auto align="center" gap={20}>
                {!!user && (
                    <ToggleSidebarButtonContainer>
                        <Button
                            onClick={() => {
                                dispatch(toggleSidebar())
                            }}
                            appearance="text"
                            icon={<SidebarIcon size={20} />}
                        />
                    </ToggleSidebarButtonContainer>
                )}
                <MobileToggleSidebarButtonContainer>
                    <Button
                        onClick={() => {
                            dispatch(toggleMobileSidebar())
                        }}
                        appearance="secondary"
                        icon={<SidebarIcon />}
                    />
                </MobileToggleSidebarButtonContainer>

                <Breadcrumbs
                    maxItems={4}
                    aria-label="breadcrumbs"
                    className="breadcrumbs"
                >
                    {!!activeFolder &&
                        folderPath?.map((folder, index) => (
                            <Link
                                key={index}
                                href={`/folder/${folder.id}`}
                                legacyBehavior
                            >
                                <Flex as="a" align="center" gap={10}>
                                    <FolderIcon />
                                    <span>{folder.name || "Sans nom"}</span>
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
                                legacyBehavior
                            >
                                <Flex as="a" align="center" gap={10}>
                                    {item.type === "folder" && (
                                        <FolderIcon style={{ flexShrink: 0 }} />
                                    )}
                                    <span>
                                        {(item.type === "document"
                                            ? item.title
                                            : item.name) || "Sans titre"}
                                    </span>
                                </Flex>
                            </Link>
                        ))}
                    {!activeDocument && !activeFolder && (
                        <Flex as="a" align="center" gap={10}>
                            {pageIcon}
                            {pageTitle}
                        </Flex>
                    )}
                </Breadcrumbs>
            </Flex>
            <Flex
                align="center"
                gap={8}
                style={{ justifySelf: "flex-end", flexShrink: 0 }}
            >
                {!user && (
                    <Button
                        appearance="secondary"
                        onClick={() => router.push("/auth")}
                        icon={<UserIcon />}
                    >
                        Se connecter
                    </Button>
                )}
                {!!activeDocument && (
                    <>
                        <Button
                            appearance="secondary"
                            icon={
                                activeDocument?.favorite ? (
                                    <FavoriteFillIcon />
                                ) : (
                                    <FavoriteIcon />
                                )
                            }
                            onClick={() => {
                                dispatch(
                                    documentsApi.updateDocument({
                                        id: docId,
                                        favorite: !activeDocument.favorite
                                    })
                                )
                            }}
                        />
                        <ShareDocumentButton documentId={docId}>
                            Partager
                        </ShareDocumentButton>
                    </>
                )}
                {(!!activeDocument || !!activeFolder) && (
                    <>
                        <VerticalSeparator />
                        <Button appearance="text" icon={<MoreIcon />} />
                    </>
                )}
            </Flex>
        </Container>
    )
}

const Container = styled.div`
    height: 60px;
    padding: 0 20px;
    display: flex;
    flex-shrink: 0;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--color-n300);

    @media (max-width: 768px) {
        .breadcrumbs {
            display: none;
        }
    }
`

const ToggleSidebarButtonContainer = styled.div`
    display: block;

    @media (max-width: 768px) {
        display: none;
    }
`

const MobileToggleSidebarButtonContainer = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: block;
    }
`

const VerticalSeparator = styled.div`
    width: 1px;
    height: 30px;
    margin: 0 5px;
    background-color: var(--color-n300);
`
