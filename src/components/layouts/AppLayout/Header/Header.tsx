import Link from "next/link"
import { ReactNode } from "react"
import {
    MdOutlineFolderOpen as FolderIcon,
    MdOutlineMenu as MenuIcon,
    MdOutlineMenuOpen as MenuOpenIcon,
    MdOutlineMoreHoriz as MoreIcon
} from "react-icons/md"
import AddDocumentButton from "src/components/AddDocumentButton"
import Flex from "src/components/Flex"
import ShareDocumentButton from "src/components/ShareDocumentButton"
import Breadcrumbs from "src/components/ui/Breadcrumbs"
import Button from "src/components/ui/Button"
import { useGetDocumentsQuery } from "src/services/documents"
import { useGetFoldersQuery } from "src/services/folders"
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

    const { sidebarOpen, mobileSidebarOpen } = useAppSelector(
        (state) => state.ui
    )
    const { activeFolder, activeDocument } = useAppSelector(
        (state) => state.navigation
    )

    const { folderName } = useGetFoldersQuery(null, {
        selectFromResult: ({ data }) => ({
            folderName: data?.find((f) => f.id === activeFolder)?.name
        }),
        skip: !user
    })

    const { documentPath } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            documentPath: activeDocument
                ? getDocumentPath(activeDocument, data)
                : []
        }),
        skip: !user
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
                        icon={sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
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
                            mobileSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />
                        }
                    />
                </MobileToggleSidebarButtonContainer>

                <Breadcrumbs
                    maxItems={4}
                    aria-label="breadcrumbs"
                    className="breadcrumbs"
                >
                    {activeFolder && (
                        <Link href={`/folder/${activeFolder}`} legacyBehavior>
                            <Flex as="a" align="center" gap={10}>
                                <FolderIcon />
                                <span>{folderName || "Dossier"}</span>
                            </Flex>
                        </Link>
                    )}
                    {!!activeFolder &&
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
                    {!activeFolder && (
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
                {!!activeDocument && (
                    <ShareDocumentButton documentId={activeDocument}>
                        Partager
                    </ShareDocumentButton>
                )}
                {!!activeFolder && (
                    <AddDocumentButton folderId={activeFolder} />
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
