import moment from "moment"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
    RiDeleteBin7Line as DeleteIcon,
    RiEdit2Line as RenameIcon,
    RiFileAddLine as AddDocumentIcon,
    RiFolder2Line as FolderIcon,
    RiFolderAddLine as AddFolderIcon,
    RiMoreLine as MoreIcon
} from "react-icons/ri"
import * as documentsApi from "src/api/documents"
import * as foldersApi from "src/api/folders"
import CardButton from "src/components/CardButton"
import Flex from "src/components/Flex"
import FoldersDocumentsList from "src/components/FoldersDocumentsList"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Button from "src/components/ui/Button"
import Menu from "src/components/ui/navigation/Menu"
import Typography from "src/components/ui/Typography"
import { useAppDispatch, useAppSelector } from "src/store"
import { supabaseClient, withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import Grid from "@mui/material/Grid"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import useMediaQuery from "@mui/material/useMediaQuery"
import Tippy from "@tippyjs/react"

function DeleteFolderButton({ folderId }) {
    const dispatch = useAppDispatch()
    const router = useRouter()

    return (
        <Tippy content="Supprimer" arrow={false}>
            <Button
                appearance="text"
                onClick={() => {
                    if (confirm("Envoyer le dossier dans la corbeille ?")) {
                        dispatch(
                            foldersApi.updateFolder({
                                id: folderId,
                                deleted: true
                            })
                        )

                        router.push("/home")
                    }
                }}
                icon={<DeleteIcon />}
                tabIndex={-1}
            />
        </Tippy>
    )
}

function RenameFolderButton({ folderId }) {
    const dispatch = useAppDispatch()

    return (
        <Tippy content="Renommer" arrow={false}>
            <Button
                appearance="text"
                onClick={() => {
                    const folderName = prompt("Renommer le dossier :")
                    if (!folderName) return

                    dispatch(
                        foldersApi.updateFolder({
                            id: folderId,
                            name: folderName
                        })
                    )

                    alert("Dossier renommé.")
                }}
                icon={<RenameIcon />}
                tabIndex={-1}
            />
        </Tippy>
    )
}

function FolderOptionsButton({ folderId }) {
    const dispatch = useAppDispatch()

    const onClickDeleteFolder = (folderId) => {
        if (confirm("Envoyer ce dossier dans la corbeille ?")) {
            dispatch(
                foldersApi.updateFolder({
                    id: folderId,
                    deleted: true
                })
            )
        }
    }

    return (
        <Menu
            content={(instance) => (
                <Flex
                    column
                    style={{
                        minWidth: 175,
                        padding: "0.25rem"
                    }}
                >
                    <Menu.Item
                        icon={<DeleteIcon />}
                        title="Supprimer"
                        menu={instance}
                        onClick={() => onClickDeleteFolder(folderId)}
                        style={{
                            color: "var(--color-red)"
                        }}
                    />
                </Flex>
            )}
            placement="bottom-end"
        >
            <Button size="small" appearance="text" icon={<MoreIcon />} />
        </Menu>
    )
}

function DocumentOptionsButton({ documentId }) {
    const dispatch = useAppDispatch()

    const onClickDeleteDocument = (documentId) => {
        if (confirm("Envoyer ce document dans la corbeille ?")) {
            dispatch(
                documentsApi.updateDocument({
                    id: documentId,
                    deleted: true
                })
            )
        }
    }

    return (
        <Menu
            content={(instance) => (
                <Flex
                    column
                    style={{
                        padding: "0.25rem"
                    }}
                >
                    <Menu.Item
                        icon={<DeleteIcon />}
                        title="Supprimer"
                        menu={instance}
                        onClick={() => onClickDeleteDocument(documentId)}
                        style={{
                            color: "var(--color-red)"
                        }}
                    />
                </Flex>
            )}
            placement="bottom-end"
        >
            <Button size="small" appearance="text" icon={<MoreIcon />} />
        </Menu>
    )
}

function Folder() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { folderId } = router.query as { folderId: string }

    const [textPreviews, setTextPreviews] = useState({})
    const [loadingTextPreviews, setLoadingTextPreviews] = useState(true)

    const { folder, isLoadingFolder } = useAppSelector((state) => ({
        folder: state.folders.folders.find((f) => f.id === folderId),
        isLoadingFolder: state.folders.isLoading
    }))

    const { subfolders } = useAppSelector((state) => ({
        subfolders: state.folders.folders.filter(
            (f) => f.parent_id === folderId
        )
    }))

    const { documents } = useAppSelector((state) => state.documents)

    const { subdocuments } = useAppSelector((state) => ({
        subdocuments: state.documents.documents.filter(
            (d) => d.folder_id === folderId && !d.parent_id
        )
    }))

    useEffect(() => {
        if (folderId && subdocuments.length) {
            setLoadingTextPreviews(true)

            supabaseClient
                .from("documents")
                .select("id, text_preview")
                .in(
                    "id",
                    subdocuments.map((d) => d.id)
                )
                .then(({ data, error }) => {
                    if (error) {
                        console.error(error)
                        return
                    }

                    setTextPreviews(
                        (data || []).reduce((acc, curr) => {
                            acc[curr.id] = curr.text_preview
                            return acc
                        }, {})
                    )
                    setLoadingTextPreviews(false)
                })
        }
    }, [folderId, subdocuments.length])

    const onClickAddDocument = async ({ folderId }) => {
        const res = (await dispatch(
            documentsApi.insertDocument({ folder_id: folderId })
        )) as any

        if (res.payload) {
            router.push(`/doc/${res.payload.id}`)
        }
    }

    const onClickAddFolder = async ({ folderId }) => {
        const folderName = prompt("Nom du dossier :")
        if (!folderName) return
        dispatch(
            foldersApi.insertFolder({ name: folderName, parent_id: folderId })
        )
    }

    const stringifyDate = (date) =>
        `${moment(new Date(date)).format("DD/MM/YYYY")} à ${moment(
            new Date(date)
        ).format("HH:mm")}`

    const columns = [
        {
            label: "Titre",
            sortable: true,
            field: "title",
            type: "string",
            getCellContent: (item) => {
                const subdocumentsCount = documents.filter(
                    (d) => d.folder_id === item.id
                ).length

                const textPreview = loadingTextPreviews
                    ? "..."
                    : textPreviews[item.id] || "Document vide"

                return (
                    <Flex column>
                        <Typography.Text weight={500}>
                            {item.type === "folder"
                                ? item.name.trim() || "Sans nom"
                                : item.title.trim() || "Sans titre"}
                        </Typography.Text>
                        <Typography.Text
                            type="secondary"
                            lineHeight={1.2}
                            small
                        >
                            {item.type === "folder"
                                ? `${subdocumentsCount} Document${
                                      subdocumentsCount > 1 ? "s" : ""
                                  }`
                                : textPreview}
                        </Typography.Text>
                    </Flex>
                )
            }
        },
        {
            label: "Modifié le",
            sortable: true,
            field: "updated_at",
            type: "date",
            align: "right",
            width: "30%",
            hideOnSmallScreens: true,
            getCellContent: (item) => (
                <Typography.Text type="secondary" small>
                    {stringifyDate(item.updated_at)}
                </Typography.Text>
            )
        },
        {
            width: 60,
            sortable: false,
            getCellContent: (item) => (
                <div onClick={(e) => e.stopPropagation()}>
                    {item.type === "folder" ? (
                        <FolderOptionsButton folderId={item.id} />
                    ) : (
                        <DocumentOptionsButton documentId={item.id} />
                    )}
                </div>
            )
        }
    ]

    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    {!!folder && (
                        <>
                            <FolderTitle>
                                <Typography.Title level={3}>
                                    {folder.name.trim() || "Dossier sans nom"}
                                </Typography.Title>
                                <Flex gap={5}>
                                    <RenameFolderButton folderId={folderId} />
                                    <DeleteFolderButton folderId={folderId} />
                                </Flex>
                            </FolderTitle>
                            <Grid
                                container
                                padding="none"
                                rowSpacing={1}
                                columnSpacing={2}
                                width="100%"
                            >
                                <Grid item width={300} zeroMinWidth>
                                    <CardButton
                                        title="Nouveau document"
                                        description="Créer un nouveau document vierge"
                                        icon={<AddDocumentIcon />}
                                        onClick={() =>
                                            onClickAddDocument({ folderId })
                                        }
                                    />
                                </Grid>
                                <Grid item width={300} zeroMinWidth>
                                    <CardButton
                                        title="Nouveau dossier"
                                        description="Créer un sous-dossier"
                                        icon={<AddFolderIcon />}
                                        onClick={() =>
                                            onClickAddFolder({ folderId })
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <FoldersDocumentsList
                                folders={subfolders || []}
                                documents={subdocuments || []}
                                columns={columns}
                            />
                        </>
                    )}
                    {!folder && !isLoadingFolder && (
                        <Typography.Text>
                            Désolé, ce dossier n&apos;existe pas. S&apos;il
                            existait avant, cela signifie qu&apos;il a été
                            supprimé.
                        </Typography.Text>
                    )}
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Folder.Layout = AppLayout
Folder.Title = "Dossier"

const Container = styled.div`
    padding: 50px 25px;
`

const Content = styled.div`
    margin: 25px auto;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
`

const FolderTitle = styled.div`
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    gap: 20px;
    margin-bottom: 20px;

    & button {
        opacity: 0;
        transition: opacity ease-out 100ms;
    }

    &:hover button {
        opacity: 1;
    }
`

export const getServerSideProps = withPageAuth()

export default Folder
