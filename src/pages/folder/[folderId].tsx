import moment from "moment"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import {
    RiAddLine as AddIcon,
    RiDeleteBin7Line as DeleteIcon,
    RiEdit2Line as RenameIcon,
    RiFolder2Line as FolderIcon,
    RiMoreLine as MoreIcon
} from "react-icons/ri"
import * as documentsApi from "src/api/documents"
import * as foldersApi from "src/api/folders"
import AddDocumentButton from "src/components/AddDocumentButton"
import Flex from "src/components/Flex"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Button from "src/components/ui/Button"
import Menu from "src/components/ui/navigation/Menu"
import Typography from "src/components/ui/Typography"
import { useAppDispatch, useAppSelector } from "src/store"
import { withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
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

function Folder() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { folderId } = router.query as { folderId: string }

    const [orderBy, setOrderDocumentsBy] = useState<"title" | "updated_at">(
        "title"
    )
    const [order, setOrder] = useState<"desc" | "asc">("asc")

    const { folder, isLoadingFolder } = useAppSelector((state) => ({
        folder: state.folders.folders.find((f) => f.id === folderId),
        isLoadingFolder: state.folders.isLoading
    }))

    const { subfolders } = useAppSelector((state) => ({
        subfolders: state.folders.folders.filter(
            (f) => f.parent_id === folderId
        )
    }))

    const { documents } = useAppSelector((state) => ({
        documents: state.documents.documents.filter(
            (d) => d.folder_id === folderId && !d.parent_id
        )
    }))

    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    {!!folder && (
                        <>
                            <FolderTitle>
                                <Typography.Title level={3}>
                                    {folder.name}
                                </Typography.Title>
                                <Flex gap={5}>
                                    <RenameFolderButton folderId={folderId} />
                                    <DeleteFolderButton folderId={folderId} />
                                </Flex>
                            </FolderTitle>
                            <div>
                                <AddDocumentButton folderId={folderId}>
                                    Créer un document
                                </AddDocumentButton>
                            </div>
                            <DocumentListWrapper>
                                <Table
                                    sx={{
                                        tableLayout: "fixed",
                                        borderSpacing: "0 0.25rem",
                                        borderCollapse: "separate"
                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="80%">
                                                <TableSortLabel
                                                    active={orderBy === "title"}
                                                    direction={order}
                                                    onClick={() => {
                                                        setOrderDocumentsBy(
                                                            "title"
                                                        )
                                                        setOrder((prev) =>
                                                            prev === "asc"
                                                                ? "desc"
                                                                : "asc"
                                                        )
                                                    }}
                                                >
                                                    Titre
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell
                                                width="35%"
                                                className="updated_atHeaderCell"
                                            >
                                                <TableSortLabel
                                                    active={
                                                        orderBy === "updated_at"
                                                    }
                                                    direction={order}
                                                    onClick={() => {
                                                        setOrderDocumentsBy(
                                                            "updated_at"
                                                        )
                                                        setOrder((prev) =>
                                                            prev === "asc"
                                                                ? "desc"
                                                                : "asc"
                                                        )
                                                    }}
                                                >
                                                    Modifié le
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell width={60} />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(documents || [])
                                            .sort((a, b) => {
                                                if (orderBy === "title") {
                                                    return (
                                                        (
                                                            a.title || ""
                                                        ).localeCompare(
                                                            b.title || ""
                                                        ) *
                                                        (order === "asc"
                                                            ? 1
                                                            : -1)
                                                    )
                                                }

                                                if (orderBy === "updated_at") {
                                                    return (
                                                        (new Date(
                                                            b.updated_at
                                                        ).getTime() -
                                                            new Date(
                                                                a.updated_at
                                                            ).getTime()) *
                                                        (order === "asc"
                                                            ? 1
                                                            : -1)
                                                    )
                                                }
                                            })
                                            .map((document) => (
                                                <TableRow
                                                    key={document.id}
                                                    sx={{
                                                        ":hover": {
                                                            background:
                                                                "var(--color-n75)"
                                                        },
                                                        borderTopLeftRadius:
                                                            "0.5rem",
                                                        borderBottomLeftRadius:
                                                            "0.5rem",
                                                        transition:
                                                            "background-color 0.2s",
                                                        cursor: "pointer"
                                                    }}
                                                    component={Link}
                                                    href={`/doc/${document.id}`}
                                                >
                                                    <TableCell
                                                        sx={{
                                                            fontWeight: 500,
                                                            borderTopLeftRadius:
                                                                "0.5rem",
                                                            borderBottomLeftRadius:
                                                                "0.5rem",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "0.5rem"
                                                        }}
                                                    >
                                                        <DocumentIcon />
                                                        <Typography.Text
                                                            style={{
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap"
                                                            }}
                                                        >
                                                            {document.title}
                                                        </Typography.Text>
                                                    </TableCell>
                                                    <TableCell
                                                        width={10}
                                                        className="updated_atCell"
                                                    >
                                                        <Typography.Text type="secondary">
                                                            {moment(
                                                                new Date(
                                                                    document.updated_at
                                                                )
                                                            ).format(
                                                                "DD/MM/YYYY"
                                                            )}{" "}
                                                            à{" "}
                                                            {moment(
                                                                new Date(
                                                                    document.updated_at
                                                                )
                                                            ).format("HH:mm")}
                                                        </Typography.Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Menu
                                                            content={(
                                                                instance
                                                            ) => (
                                                                <Flex
                                                                    column
                                                                    style={{
                                                                        minWidth: 175,
                                                                        padding:
                                                                            "0.25rem"
                                                                    }}
                                                                >
                                                                    <Menu.Item
                                                                        icon={
                                                                            <DeleteIcon />
                                                                        }
                                                                        title="Supprimer"
                                                                        menu={
                                                                            instance
                                                                        }
                                                                        onClick={() => {
                                                                            if (
                                                                                confirm(
                                                                                    "Êtes-vous certain de vouloir supprimer ce dossier ?"
                                                                                )
                                                                            ) {
                                                                                dispatch(
                                                                                    foldersApi.updateFolder(
                                                                                        {
                                                                                            id: folderId,
                                                                                            deleted:
                                                                                                true
                                                                                        }
                                                                                    )
                                                                                )

                                                                                router.push(
                                                                                    "/home"
                                                                                )
                                                                            }
                                                                        }}
                                                                        style={{
                                                                            color: "var(--color-red)"
                                                                        }}
                                                                    />
                                                                </Flex>
                                                            )}
                                                            placement="bottom-end"
                                                        >
                                                            <Button
                                                                size="small"
                                                                appearance="text"
                                                                onClick={(e) =>
                                                                    e.preventDefault()
                                                                }
                                                            >
                                                                <MoreIcon />
                                                            </Button>
                                                        </Menu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </DocumentListWrapper>

                            {/* <DocumentList column gap={5}>
                                <Flex
                                    align="center"
                                    justify="space-between"
                                    gap={10}
                                >
                                    <Select
                                        value={sortOrder}
                                        onValueChange={(value) => {
                                            setSortOrder(value)
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
                                    </Select>

                                    <AddDocumentButton
                                        folderId={folderId}
                                        appearance="primary"
                                    >
                                        Nouveau
                                    </AddDocumentButton>
                                </Flex>
                                <Separator />
                                {!!subfolders.length &&
                                    subfolders.map((folder) => (
                                        <Button
                                            key={folder.id}
                                            appearance="secondary"
                                            icon={<FolderIcon />}
                                            onClick={() => {
                                                router.push(
                                                    `/folder/${folder.id}`
                                                )
                                            }}
                                        >
                                            {folder.name}
                                        </Button>
                                    ))}

                                {documents
                                    ?.sort((a, b) => {
                                        switch (sortOrder) {
                                            case "a-z":
                                                return (
                                                    a.title || ""
                                                ).localeCompare(b.title || "")
                                            case "z-a":
                                                return (
                                                    b.title || ""
                                                ).localeCompare(a.title || "")
                                            case "recent":
                                                return (
                                                    new Date(
                                                        b.updated_at
                                                    ).getTime() -
                                                    new Date(
                                                        a.updated_at
                                                    ).getTime()
                                                )

                                            case "old":
                                                return (
                                                    new Date(
                                                        a.updated_at
                                                    ).getTime() -
                                                    new Date(
                                                        b.updated_at
                                                    ).getTime()
                                                )
                                        }
                                    })
                                    .map((document, index) => (
                                        <DocumentLink
                                            href={`/doc/${document.id}`}
                                            key={index}
                                            title={
                                                document.title || "Sans titre"
                                            }
                                            status={`Modifié le ${moment(
                                                new Date(document.updated_at)
                                            ).format("DD/MM/YYYY")} à ${moment(
                                                new Date(document.updated_at)
                                            ).format("HH:mm")}`}
                                            actions={
                                                <Flex align="center">
                                                    <DeleteDocumentButton
                                                        documentId={document.id}
                                                    />
                                                </Flex>
                                            }
                                        />
                                    ))}
                            </DocumentList> */}
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

    & button {
        opacity: 0;
        transition: opacity ease-out 100ms;
    }

    &:hover button {
        opacity: 1;
    }
`

const DocumentIcon = styled.div`
    width: 32px;
    height: 44px;
    border: 1px solid var(--color-n300);
    border-radius: 4px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgb(200,200,200)' width='21' height='32'%3E%3Cg%3E%3Crect width='25' height='2' y='0'/%3E%3Crect width='25' height='2' y='4'/%3E%3Crect width='15' height='2' y='8'/%3E%3Crect width='30' height='2' y='14'/%3E%3Crect width='20' height='2' y='18'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center center;
    flex-shrink: 0;
`

const DocumentListWrapper = styled.div`
    td {
        border: none;
    }

    td,
    th {
        font-family: inherit;
        padding: 0.5rem;
    }

    span {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    width: "100%";
    display: flex;

    @media screen and (max-width: 450px) {
        .updated_atCell,
        .updated_atHeaderCell {
            display: none;
        }
    }
`

const DocumentList = styled(Flex)`
    margin-top: 20px;
`

export const getServerSideProps = withPageAuth()

export default Folder
