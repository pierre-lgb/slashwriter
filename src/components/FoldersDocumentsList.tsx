import { useRouter } from "next/router"
import { useState } from "react"
import { RiFolder2Line as FolderIcon } from "react-icons/ri"
import styled from "styled-components"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import useMediaQuery from "@mui/material/useMediaQuery"

import Flex from "./Flex"
import Loader from "./ui/Loader"
import Typography from "./ui/Typography"

export interface FoldersDocumentsListProps {
    columns: any[]
    folders?: any[]
    documents?: any[]
    loading?: boolean
    error?: string
    foldersLabel?: string
    documentsLabel?: string
}

export default function FoldersDocumentsList(props: FoldersDocumentsListProps) {
    const {
        folders,
        documents,
        columns,
        loading,
        error,
        documentsLabel = "Documents",
        foldersLabel = "Dossiers"
    } = props

    const router = useRouter()

    const [orderBy, setOrderBy] = useState<string>("title")
    const [order, setOrder] = useState<"desc" | "asc">("asc")

    const matchesSmallScreen = useMediaQuery("(max-width: 450px)")

    const sortHandler = (a, b) => {
        const type = columns.find((c) => c.field === orderBy)?.type

        if (!type) {
            return 1
        }

        if (type === "string") {
            return (
                (a[orderBy] || "").localeCompare(b[orderBy] || "") *
                (order === "asc" ? 1 : -1)
            )
        }

        if (type === "date") {
            return (
                (new Date(b[orderBy]).getTime() -
                    new Date(a[orderBy]).getTime()) *
                (order === "asc" ? 1 : -1)
            )
        }
    }

    return (
        <Wrapper>
            <Table sx={{ tableLayout: "fixed" }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => {
                            return !(
                                column.hideOnSmallScreens && matchesSmallScreen
                            ) ? (
                                <TableCell
                                    key={index}
                                    width={column.width}
                                    align={column.align}
                                >
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === column.field}
                                            direction={order}
                                            onClick={() => {
                                                setOrder((prev) =>
                                                    orderBy === column.field
                                                        ? prev === "asc"
                                                            ? "desc"
                                                            : "asc"
                                                        : "asc"
                                                )

                                                setOrderBy(column.field)
                                            }}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ) : null
                        })}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {!loading && !error && !!folders?.length && (
                        <>
                            <TableRow style={{ animation: "fade-in 0.5s" }}>
                                <TableCell style={{ paddingTop: "1rem" }}>
                                    <Typography.Text type="secondary">
                                        {foldersLabel}
                                    </Typography.Text>
                                </TableCell>
                            </TableRow>
                            {folders.sort(sortHandler).map((folder) => (
                                <ListItem
                                    key={folder.id}
                                    onClick={() => {
                                        router.push(`/folder/${folder.id}`)
                                    }}
                                >
                                    {columns.map((column, index) => {
                                        const cellContent =
                                            column.getCellContent?.({
                                                type: "folder",
                                                ...folder
                                            })

                                        return !(
                                            column.hideOnSmallScreens &&
                                            matchesSmallScreen
                                        ) ? (
                                            <TableCell
                                                key={index}
                                                align={column.align}
                                            >
                                                {index === 0 ? (
                                                    <Flex gap={10}>
                                                        <WrappedFolderIcon />
                                                        {cellContent}
                                                    </Flex>
                                                ) : (
                                                    cellContent
                                                )}
                                            </TableCell>
                                        ) : null
                                    })}
                                </ListItem>
                            ))}
                        </>
                    )}
                    {!loading && !error && !!documents?.length && (
                        <>
                            <TableRow style={{ animation: "fade-in 0.5s" }}>
                                <TableCell style={{ paddingTop: "1rem" }}>
                                    <Typography.Text type="secondary">
                                        {documentsLabel}
                                    </Typography.Text>
                                </TableCell>
                            </TableRow>
                            {documents.sort(sortHandler).map((document) => (
                                <ListItem
                                    key={document.id}
                                    onClick={() => {
                                        router.push(`/doc/${document.id}`)
                                    }}
                                >
                                    {columns.map((column, index) => {
                                        const cellContent =
                                            column.getCellContent?.({
                                                type: "document",
                                                ...document
                                            })

                                        return !(
                                            column.hideOnSmallScreens &&
                                            matchesSmallScreen
                                        ) ? (
                                            <TableCell
                                                key={index}
                                                align={column.align}
                                            >
                                                {index === 0 ? (
                                                    <Flex gap={10}>
                                                        <DocumentIcon />
                                                        {cellContent}
                                                    </Flex>
                                                ) : (
                                                    cellContent
                                                )}
                                            </TableCell>
                                        ) : null
                                    })}
                                </ListItem>
                            ))}
                        </>
                    )}
                </TableBody>
            </Table>
            {!loading && !error && !folders?.length && !documents?.length && (
                <Flex align="center" justify="center" style={{ marginTop: 20 }}>
                    <Typography.Text type="secondary">
                        Aucun élement à afficher.
                    </Typography.Text>
                </Flex>
            )}

            {loading && (
                <Flex
                    align="center"
                    justify="center"
                    style={{ marginTop: 20, width: "100%" }}
                >
                    <Loader />
                </Flex>
            )}

            {error && (
                <Flex align="center" justify="center" style={{ marginTop: 20 }}>
                    <Typography.Text type="danger" align="center">
                        Une erreur est survenue. <br />
                        {error}
                    </Typography.Text>
                </Flex>
            )}
        </Wrapper>
    )
}

function WrappedFolderIcon() {
    return (
        <Flex
            align="center"
            justify="center"
            style={{
                width: 32,
                height: 44,
                flexShrink: 0
            }}
        >
            <FolderIcon size={24} />
        </Flex>
    )
}

const ListItem = styled(TableRow)`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;

    &:hover {
        background-color: var(--color-n75);
        transition: all 0.2s;
    }

    * {
        overflow: hidden;
        text-overflow: ellipsis;
        transition: opacity 0.2s;
    }

    animation: fade-in 0.5s;
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

const Wrapper = styled.div`
    margin-top: 20px;
    td {
        border: none;
    }

    td,
    th {
        font-family: inherit;
        font-size: 0.9rem;
        padding: 0.5rem;
    }

    @media screen and (max-width: 450px) {
        .updatedAtCell,
        .updatedAtHeaderCell {
            display: none;
        }
    }
`
