import Link from "next/link"
import { ReactNode } from "react"
import {
    RiFolder3Line as FolderIcon,
    RiHeartFill as FavoriteFillIcon,
    RiHeartLine as FavoriteIcon,
    RiMenuFoldLine as CloseMenuIcon,
    RiMenuUnfoldLine as OpenMenuIcon,
    RiMoreFill as MoreIcon
} from "react-icons/ri"
import AddDocumentButton from "src/components/AddDocumentButton"
import Flex from "src/components/Flex"
import ShareDocumentButton from "src/components/ShareDocumentButton"
import Breadcrumbs from "src/components/ui/Breadcrumbs"
import Button from "src/components/ui/Button"
import { useGetDocumentsQuery, useUpdateDocumentMutation } from "src/services/documents"
import { useGetFoldersQuery } from "src/services/folders"
import { useAppDispatch, useAppSelector } from "src/store"
import { toggleMobileSidebar, toggleSidebar } from "src/store/ui"
import styled from "styled-components"

interface HeaderProps {
    pageTitle: string
    pageIcon: ReactNode
}

export default function Header({ pageTitle, pageIcon }: HeaderProps) {
    const dispatch = useAppDispatch()
    const [updateDocument] = useUpdateDocumentMutation()

    const { sidebarOpen, mobileSidebarOpen } = useAppSelector(
        (state) => state.ui
    )
    const { activeFolderId, activeDocumentId } = useAppSelector(
        (state) => state.navigation
    )

    const { activeFolder } = useGetFoldersQuery(null, {
        selectFromResult: ({ data }) => ({
            activeFolder: data?.find((f) => f.id === activeFolderId)
        })
    })

    const { activeDocument } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            activeDocument: data?.find((d) => d.id === activeDocumentId)
        })
    })

    const { documentPath } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            documentPath: activeDocumentId
                ? getDocumentPath(activeDocumentId, data)
                : []
        })
    })

    return (
        <Container className="header">
            <Flex auto align="center" gap={20}>
                <ToggleSidebarButtonContainer>
                    <Button
                        onClick={() => {
                            dispatch(toggleSidebar())
                        }}
                        appearance="text"
                        icon={
                            sidebarOpen ? <CloseMenuIcon /> : <OpenMenuIcon />
                        }
                        size="large"
                    />
                </ToggleSidebarButtonContainer>
                <MobileToggleSidebarButtonContainer>
                    <Button
                        onClick={() => {
                            dispatch(toggleMobileSidebar())
                        }}
                        appearance="secondary"
                        icon={
                            mobileSidebarOpen ? (
                                <CloseMenuIcon />
                            ) : (
                                <OpenMenuIcon />
                            )
                        }
                    />
                </MobileToggleSidebarButtonContainer>

                <Breadcrumbs
                    maxItems={4}
                    aria-label="breadcrumbs"
                    className="breadcrumbs"
                >
                    {activeFolderId && (
                        <Link href={`/folder/${activeFolderId}`} legacyBehavior>
                            <Flex as="a" align="center" gap={10}>
                                <FolderIcon />
                                <span>{activeFolder?.name || "Dossier"}</span>
                            </Flex>
                        </Link>
                    )}
                    {!!activeFolderId &&
                        !!documentPath.length &&
                        documentPath.map((document, index) => (
                            <Link
                                key={index}
                                href={`/doc/${document.id}`}
                                legacyBehavior
                            >
                                <a>{document.title || "Sans titre"}</a>
                            </Link>
                        ))}
                    )
                    {!activeFolderId && (
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
                {!!activeDocumentId && (
                    <>
                        {/* <Button
                            appearance="text"
                            icon={
                                activeDocument?.favorite ? (
                                    <FavoriteFillIcon />
                                ) : (
                                    <FavoriteIcon />
                                )
                            }
                            onClick={() => {
                                updateDocument({
                                    id: activeDocumentId,
                                    update: {
                                        favorite: !activeDocument.favorite
                                    }
                                })
                            }}
                        /> */}
                        <ShareDocumentButton documentId={activeDocumentId}>
                            Partager
                        </ShareDocumentButton>
                    </>
                )}
                {!!activeFolderId && (
                    <AddDocumentButton folderId={activeFolderId} />
                )}
                {(!!activeDocumentId || !!activeFolderId) && (
                    <>
                        <VerticalSeparator />
                        <Button appearance="text" icon={<MoreIcon />} />
                    </>
                )}
            </Flex>
        </Container>
    )
}

function getDocumentPath(documentId: string, documents: any[]) {
    const document = (documents || []).find((d) => d.id === documentId)

    if (!document) return []

    let path = [document]
    let parent = documents.find((d) => d.id === document.parent)

    while (parent) {
        path.unshift(parent)
        if (parent.parent === null) break

        parent = documents.find((d) => d.id === parent.parent)
    }

    return path
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
