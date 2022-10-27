import { Fragment, ReactNode } from "react"
import AddDocumentButton from "src/components/AddDocumentButton"
import Flex from "src/components/Flex"
import ShareDocumentButton from "src/components/ShareDocumentButton"
import Button from "src/components/ui/Button"
import { useGetDocumentsQuery } from "src/services/documents"
import { useGetFoldersQuery } from "src/services/folders"
import { useAppDispatch, useAppSelector } from "src/store"
import { toggleMobileSidebar, toggleSidebar } from "src/store/ui"
import { useUser } from "src/utils/supabase"
import styled from "styled-components"

import FolderOpenOutlined from "@mui/icons-material/FolderOpenOutlined"
import MenuOpenOutlined from "@mui/icons-material/MenuOpenOutlined"
import MenuOutlined from "@mui/icons-material/MenuOutlined"
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined"

import Breadcrumb from "./components/Breadcrumb"

interface HeaderProps {
    pageTitle: string
    pageIcon: ReactNode
}

const BREADCRUMB_ITEMS_MAX = 3

export default function Header({ pageTitle, pageIcon }: HeaderProps) {
    const { user } = useUser()
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
        <Container align="center" gap={20}>
            <ToggleSidebarButtonContainer>
                <ToggleSidebarButton
                    as="button"
                    onClick={() => {
                        dispatch(toggleSidebar())
                    }}
                >
                    {sidebarOpen ? <MenuOpenOutlined /> : <MenuOutlined />}
                </ToggleSidebarButton>
            </ToggleSidebarButtonContainer>
            <MobileToggleSidebarButtonContainer>
                <ToggleSidebarButton
                    as="button"
                    onClick={() => {
                        dispatch(toggleMobileSidebar())
                    }}
                >
                    {mobileSidebarOpen ? (
                        <MenuOpenOutlined />
                    ) : (
                        <MenuOutlined />
                    )}
                </ToggleSidebarButton>
            </MobileToggleSidebarButtonContainer>

            <Breadcrumb>
                {!!activeFolder ? (
                    <>
                        <Breadcrumb.Item
                            text={folderName || "Dossier"}
                            icon={<FolderOpenOutlined />}
                            href={`/folder/${activeFolder}`}
                        />

                        {documentPath.length > BREADCRUMB_ITEMS_MAX && (
                            <>
                                <Breadcrumb.Separator />
                                <Breadcrumb.Item text="..." />
                            </>
                        )}
                        {!!documentPath.length &&
                            documentPath
                                .slice(-BREADCRUMB_ITEMS_MAX)
                                .map((document, index) => (
                                    <Fragment key={index}>
                                        <Breadcrumb.Separator />
                                        <Breadcrumb.Item
                                            text={
                                                document.title || "Sans titre"
                                            }
                                            href={`/doc/${document.id}`}
                                        />
                                    </Fragment>
                                ))}
                    </>
                ) : (
                    <Breadcrumb.Item text={pageTitle} icon={pageIcon} />
                )}
            </Breadcrumb>

            <Flex align="center" gap={8}>
                {!!activeDocument && (
                    <ShareDocumentButton documentId={activeDocument} />
                )}
                {!!activeFolder && (
                    <AddDocumentButton folderId={activeFolder} border />
                )}
                {!!activeFolder && (
                    <>
                        <VerticalSeparator />
                        {!!activeDocument ? (
                            <Button
                                size="medium"
                                appearance="text"
                                icon={<MoreHorizOutlined />}
                                onClick={() => console.log("document options")}
                            />
                        ) : (
                            <Button
                                appearance="text"
                                icon={<MoreHorizOutlined />}
                                onClick={() => console.log("folder options")}
                            />
                        )}
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

const Container = styled(Flex)`
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid var(--color-n300);
    flex-shrink: 0;
    width: 100%;
`

const ToggleSidebarButton = styled(Flex)`
    background: none;
    border: none;
    color: var(--color-n600);
    padding: 5px;
    border-radius: 4px;
    outline-color: var(--color-n200);
    cursor: pointer;

    &:hover {
        background-color: var(--color-n75);
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
