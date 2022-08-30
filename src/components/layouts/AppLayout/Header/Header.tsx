import { Fragment, ReactElement } from 'react'
import AddDocumentButton from 'src/components/AddDocumentButton'
import Flex from 'src/components/Flex'
import ShareDocumentButton from 'src/components/ShareDocumentButton'
import Button from 'src/components/ui/Button'
import { useGetDocumentsQuery } from 'src/services/documents'
import { useAppDispatch, useAppSelector } from 'src/store'
import { toggleSidebar } from 'src/store/ui'
import { useUser } from 'src/utils/supabase'
import styled from 'styled-components'

import FolderOpenOutlined from '@mui/icons-material/FolderOpenOutlined'
import MenuOpenOutlined from '@mui/icons-material/MenuOpenOutlined'
import MenuOutlined from '@mui/icons-material/MenuOutlined'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'

import Breadcrumb from './components/Breadcrumb'

interface HeaderProps {
    pageTitle: string
    pageIcon: ReactElement
}

const BREADCRUMB_ITEMS_MAX = 3

export default function Header({ pageTitle, pageIcon }: HeaderProps) {
    const { user } = useUser()
    const dispatch = useAppDispatch()

    const { sidebarOpen } = useAppSelector((state) => state.ui)
    const { currentFolder, currentDocument } = useAppSelector(
        (state) => state.navigation
    )

    const { documentPath } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            documentPath: currentDocument
                ? getDocumentPath(currentDocument.id, data)
                : []
        }),
        skip: !user
    })

    return (
        <Container align="center" gap={20}>
            <ToggleSidebarButton
                as="button"
                onClick={() => {
                    dispatch(toggleSidebar())
                }}
            >
                {sidebarOpen ? <MenuOpenOutlined /> : <MenuOutlined />}
            </ToggleSidebarButton>
            <Breadcrumb>
                {!!currentFolder ? (
                    <>
                        <Breadcrumb.Item
                            text={currentFolder.name}
                            icon={<FolderOpenOutlined />}
                            href={`/folder/${currentFolder.id}`}
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
                {!!currentDocument && <ShareDocumentButton />}
                {!!currentFolder && (
                    <AddDocumentButton folderId={currentFolder.id} border />
                )}
                {!!currentFolder && (
                    <>
                        <VerticalSeparator />
                        {!!currentDocument ? (
                            <Button
                                icon={<MoreHorizOutlined fontSize="small" />}
                            />
                        ) : (
                            <Button
                                icon={<MoreHorizOutlined fontSize="small" />}
                            />
                        )}
                    </>
                )}
            </Flex>
        </Container>
    )
}

function getDocumentPath(documentId: string, documents: any[]) {
    const document = documents.find((d) => d.id === documentId)

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

    &:hover {
        cursor: pointer;
        background-color: var(--color-n75);
    }

    outline-color: var(--color-b200);
`

const VerticalSeparator = styled.div`
    width: 1px;
    height: 30px;
    margin: 0 5px;
    background-color: var(--color-n300);
`
