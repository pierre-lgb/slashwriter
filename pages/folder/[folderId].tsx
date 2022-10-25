import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AddDocumentButton from "src/components/AddDocumentButton"
import Flex from "src/components/Flex"
import AppLayout from "src/components/layouts/AppLayout"
import Separator from "src/components/Separator"
import TransitionOpacity from "src/components/TransitionOpacity"
import Button from "src/components/ui/Button"
import { useDeleteDocumentMutation, useGetDocumentsQuery } from "src/services/documents"
import {
    useDeleteFolderMutation,
    useGetFoldersQuery,
    useUpdateFolderMutation
} from "src/services/folders"
import { useAppDispatch } from "src/store"
import { setCurrentFolder } from "src/store/navigation"
import { useUser, withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import DeleteOutlined from "@mui/icons-material/DeleteOutlined"
import DriveFileRenameOutlineOutlined from "@mui/icons-material/DriveFileRenameOutlineOutlined"
import { Select } from "@supabase/ui"
import Tippy from "@tippyjs/react"

function DeleteFolderButton({ folderId }) {
    const [deleteFolder] = useDeleteFolderMutation()

    return (
        <Tippy content="Supprimer" arrow={false}>
            <Button
                onClick={() => {
                    const confirmation = confirm(
                        "Êtes-vous certain de vouloir supprimer ce dossier ?"
                    )
                    if (!confirmation) return

                    deleteFolder({
                        id: folderId
                    })
                }}
                icon={<DeleteOutlined />}
                tabIndex="-1"
            />
        </Tippy>
    )
}

function RenameFolderButton({ folderId }) {
    const [updateFolder] = useUpdateFolderMutation()
    return (
        <Tippy content="Renommer" arrow={false}>
            <Button
                onClick={() => {
                    const folderName = prompt("Renommer le dossier:")
                    if (!folderName) return
                    updateFolder({
                        id: folderId,
                        update: { name: folderName }
                    })
                }}
                icon={<DriveFileRenameOutlineOutlined />}
                tabIndex="-1"
            />
        </Tippy>
    )
}

function DeleteDocumentButton({ documentId }) {
    const [deleteDocument] = useDeleteDocumentMutation()

    return (
        <Tippy content="Supprimer" arrow={false} placement="bottom">
            <Button
                onClick={(e) => {
                    e.preventDefault()

                    !confirm("Voulez-vous supprimer ce document ?") ||
                        deleteDocument({ id: documentId })
                }}
                icon={<DeleteOutlined fontSize="small" />}
                tabIndex="-1"
            />
        </Tippy>
    )
}

function Folder() {
    const [sortOrder, setSortOrder] = useState("a-z")
    const { user } = useUser()
    const router = useRouter()
    const { folderId } = router.query as { folderId: string }
    const dispatch = useAppDispatch()

    const { folder, isFolderLoading } = useGetFoldersQuery(null, {
        selectFromResult: ({ data, isUninitialized, isLoading }) => ({
            folder: data?.find((f) => f.id === folderId),
            isFolderLoading: isUninitialized || isLoading
        }),
        skip: !user
    })

    const { documents } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            documents: data?.filter((d) => d.folder === folderId && !d.parent)
        }),
        skip: !user
    })

    useEffect(() => {
        dispatch(setCurrentFolder(folder))

        return () => {
            dispatch(setCurrentFolder(null))
        }
    }, [folder])

    return (
        <TransitionOpacity>
            <Container>
                {!!folder && (
                    <Flex column gap={10}>
                        <FolderTitle>
                            {folder.name}
                            <Flex gap={5}>
                                <RenameFolderButton folderId={folderId} />
                                <DeleteFolderButton folderId={folderId} />
                            </Flex>
                        </FolderTitle>

                        <DocumentList column gap={5}>
                            <Flex
                                align="center"
                                justify="space-between"
                                gap={10}
                            >
                                <Select
                                    onChange={(e) => {
                                        setSortOrder(e.target.value)
                                    }}
                                >
                                    <Select.Option value="a-z">
                                        De A à Z
                                    </Select.Option>
                                    <Select.Option value="z-a">
                                        De Z à A
                                    </Select.Option>
                                    <Select.Option value="recent">
                                        Récents
                                    </Select.Option>
                                    <Select.Option value="old">
                                        Anciens
                                    </Select.Option>
                                </Select>

                                <AddDocumentButton
                                    folderId={folderId}
                                    color="primary"
                                />
                            </Flex>
                            <Separator />
                            {documents
                                ?.sort((a, b) => {
                                    switch (sortOrder) {
                                        case "a-z":
                                            return a.title.localeCompare(
                                                b.title
                                            )
                                        case "z-a":
                                            return b.title.localeCompare(
                                                a.title
                                            )
                                        case "recent":
                                            return (
                                                new Date(
                                                    b.updated_at
                                                ).getTime() -
                                                new Date(a.updated_at).getTime()
                                            )

                                        case "old":
                                            return (
                                                new Date(
                                                    a.updated_at
                                                ).getTime() -
                                                new Date(b.updated_at).getTime()
                                            )
                                    }
                                })
                                .map((doc, index) => (
                                    <Link
                                        href={`/doc/${doc.id}`}
                                        key={index}
                                        passHref
                                    >
                                        <DocumentListItem
                                            key={doc.id}
                                            gap={10}
                                            as="a"
                                        >
                                            <DocumentIcon />

                                            <Flex auto column justify="center">
                                                <DocumentTitle>
                                                    {doc.title}
                                                </DocumentTitle>
                                                <DocumentMeta>
                                                    Modifié le{" "}
                                                    {moment(
                                                        new Date(doc.updated_at)
                                                    ).format("DD/MM/YYYY")}{" "}
                                                    à{" "}
                                                    {moment(
                                                        new Date(doc.updated_at)
                                                    ).format("HH:mm")}
                                                </DocumentMeta>
                                            </Flex>

                                            <Flex align="center">
                                                <DeleteDocumentButton
                                                    documentId={doc.id}
                                                />
                                            </Flex>
                                        </DocumentListItem>
                                    </Link>
                                ))}
                        </DocumentList>
                    </Flex>
                )}
                {!folder && !isFolderLoading && (
                    <span>
                        Désolé, ce dossier n&apos;existe pas. S&apos;il existait
                        avant, cela signifie qu&apos;il a été supprimé.
                    </span>
                )}
            </Container>
        </TransitionOpacity>
    )
}

const Container = styled.div`
    padding: 125px calc((100% - (700px + 50px * 2)) / 2);
    margin: 0 25px;
`

const FolderTitle = styled.h1`
    color: var(--color-n900);
    font-size: 2em;
    margin: 0;
    display: flex;
    gap: 20px;

    & button {
        opacity: 0;
        transition: opacity ease-out 100ms;
    }

    &:hover button {
        opacity: 1;
    }
`

const DocumentList = styled(Flex)`
    margin-top: 20px;
`

const DocumentListItem = styled(Flex)`
    border-radius: 5px;
    padding: 5px;
    transition: background-color ease-out 100ms;

    &:hover {
        background-color: var(--color-n50);
        cursor: pointer;
    }

    & button {
        opacity: 0;
        transition: opacity ease-out 100ms;
    }

    &:hover button {
        opacity: 1;
    }
`

const DocumentIcon = styled.div`
    width: 38px;
    height: 53px;
    border: 1px solid var(--color-n300);
    border-radius: 4px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgb(200,200,200)' width='25' height='38'%3E%3Cg%3E%3Crect width='25' height='2' y='0'/%3E%3Crect width='25' height='2' y='4'/%3E%3Crect width='15' height='2' y='8'/%3E%3Crect width='30' height='2' y='14'/%3E%3Crect width='20' height='2' y='18'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center center;
`

const DocumentTitle = styled.span`
    font-weight: 500;
    font-size: 1em;
    color: var(--color-n800);
`

const DocumentMeta = styled.span`
    font-size: 0.9em;
    color: var(--color-n600);
`

Folder.Layout = AppLayout
Folder.Title = "Dossier"

export const getServerSideProps = withPageAuth()

export default Folder
