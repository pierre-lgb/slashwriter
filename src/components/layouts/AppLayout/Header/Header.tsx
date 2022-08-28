import { ReactElement } from 'react'
import Flex from 'src/components/Flex'
import { useGetDocumentsQuery } from 'src/services/documents'
import { useAppDispatch, useAppSelector } from 'src/store'
import { toggleSidebar } from 'src/store/ui'
import { useUser } from 'src/utils/supabase'
import styled from 'styled-components'

import FolderOpenOutlined from '@mui/icons-material/FolderOpenOutlined'
import MenuOpenOutlined from '@mui/icons-material/MenuOpenOutlined'
import MenuOutlined from '@mui/icons-material/MenuOutlined'

interface HeaderProps {
    title: string
    icon: ReactElement
}

const BREADCRUMB_ITEMS_MAX = 3

export default function Header({ title, icon }: HeaderProps) {
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
            <Breadcrumb auto>
                {!!currentFolder ? (
                    <>
                        <BreadcrumbItem as="span" gap={10}>
                            <FolderOpenOutlined />
                            {currentFolder.name}
                        </BreadcrumbItem>
                        {documentPath.length > BREADCRUMB_ITEMS_MAX && (
                            <BreadcrumbItem as="span">...</BreadcrumbItem>
                        )}
                        {!!documentPath.length &&
                            documentPath
                                .slice(-BREADCRUMB_ITEMS_MAX)
                                .map((document, index) => (
                                    <BreadcrumbItem as="span" key={index}>
                                        {document.title || "Sans titre"}
                                    </BreadcrumbItem>
                                ))}
                    </>
                ) : (
                    <BreadcrumbItem as="span" gap={10}>
                        {icon}
                        {title}
                    </BreadcrumbItem>
                )}
            </Breadcrumb>
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
`

const Breadcrumb = styled(Flex)``
const BreadcrumbItem = styled(Flex)`
    color: var(--color-n600);
    flex-shrink: 0;
    align-items: center;
    font-size: 0.95em;

    & > svg {
        font-size: 1.25em;
    }

    &:last-child {
        color: var(--color-n900);
        font-weight: 500;
    }

    &:not(:first-child)::before {
        content: "/";
        margin: 10px;
        color: var(--color-n400);
    }
`
