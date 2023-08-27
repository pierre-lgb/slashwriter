"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
    RiDeleteBin7Line as DeleteIcon,
    RiEdit2Line as RenameIcon,
    RiFileAddLine as AddDocumentIcon,
    RiFolder2Line as FolderIcon,
    RiFolderAddLine as AddFolderIcon,
    RiMoreLine as MoreIcon
} from "react-icons/ri"
import { documentsApi, foldersApi } from "src/api"
import FoldersDocumentsList from "src/components/FoldersDocumentsList"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Button from "src/components/ui/Button"
import CardButton from "src/components/ui/CardButton"
import Flex from "src/components/ui/Flex"
import Menu from "src/components/ui/Menu/Menu"
import Typography from "src/components/ui/Typography"
import { useAppDispatch, useAppSelector } from "src/store"
import stringifyDate from "src/utils/stringifyDate"

import Grid from "@mui/material/Grid"
import Tippy from "@tippyjs/react"

import styles from "./Folder.module.scss"

export default function Folder() {
    const router = useRouter()
    const { folderId } = useParams()
    const dispatch = useAppDispatch()

    const { supabaseClient } = useSupabase()

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
        const folderName = prompt("Folder name :")
        if (!folderName) return
        dispatch(
            foldersApi.insertFolder({ name: folderName, parent_id: folderId })
        )
    }

    const columns = [
        {
            label: "Titre",
            sortable: true,
            field: "title",
            type: "string",
            getCellContent: (item) => {
                const subdocumentsCount = documents.filter(
                    (d) => d.folder_id === item.id && !d.parent_id
                ).length

                const textPreview = loadingTextPreviews
                    ? "..."
                    : textPreviews[item.id] || "Empty document"

                return (
                    <Flex column>
                        <Typography.Text weight={500}>
                            {item.type === "folder"
                                ? item.name.trim() || "Unnamed"
                                : item.title.trim() || "Untitled"}
                        </Typography.Text>
                        <Typography.Text
                            type="secondary"
                            lineHeight="1.2rem"
                            small
                            style={{
                                opacity: loadingTextPreviews ? 0 : 1
                            }}
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
            label: "Updated",
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
        <div className={styles.container}>
            <div className={styles.content}>
                {!!folder && (
                    <>
                        <div className={styles.folderTitle}>
                            <Typography.Title level={3}>
                                {folder.name.trim() || "Unnamed"}
                            </Typography.Title>
                            <Flex gap={5}>
                                <RenameFolderButton folderId={folderId} />
                                <DeleteFolderButton folderId={folderId} />
                            </Flex>
                        </div>
                        <Grid
                            container
                            padding="none"
                            rowSpacing={1}
                            columnSpacing={2}
                            width="100%"
                        >
                            <Grid item width={300} zeroMinWidth>
                                <CardButton
                                    title="New document"
                                    description="Create a new blank document"
                                    icon={<AddDocumentIcon />}
                                    onClick={() =>
                                        onClickAddDocument({ folderId })
                                    }
                                />
                            </Grid>
                            <Grid item width={300} zeroMinWidth>
                                <CardButton
                                    title="New folder"
                                    description="Create a new subfolder"
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
                            foldersLabel="Subfolders"
                        />
                    </>
                )}
                {!folder && !isLoadingFolder && (
                    <Typography.Text>
                        Sorry, this folder does not exist. It might have been
                        deleted.
                    </Typography.Text>
                )}
            </div>
        </div>
    )
}

function DeleteFolderButton({ folderId }) {
    const dispatch = useAppDispatch()
    const router = useRouter()

    return (
        <Tippy content="Delete" arrow={false}>
            <Button
                appearance="text"
                onClick={() => {
                    if (confirm("Send folder to trash ?")) {
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
        <Tippy content="Rename" arrow={false}>
            <Button
                appearance="text"
                onClick={() => {
                    const folderName = prompt("Rename folder :")
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
        if (confirm("Send folder to trash ?")) {
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
                        title="Delete"
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
        if (confirm("Send document to trash ?")) {
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
                        title="Delete"
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
