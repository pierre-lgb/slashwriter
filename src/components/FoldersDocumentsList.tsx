import { useRouter } from "next/navigation"
import { useState } from "react"
import { RiFolder2Line as FolderIcon } from "react-icons/ri"
import Flex from "src/components/ui/Flex"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import useMediaQuery from "@mui/material/useMediaQuery"

import styles from "./FoldersDocumentsList.module.scss"

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
        foldersLabel = "Folders"
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

        return 1
    }

    return (
        <div className={styles.container}>
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
                                <TableRow
                                    className={styles.listItem}
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
                                </TableRow>
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
                                <TableRow
                                    className={styles.listItem}
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
                                                        <div
                                                            className={
                                                                styles.documentIcon
                                                            }
                                                        />
                                                        {cellContent}
                                                    </Flex>
                                                ) : (
                                                    cellContent
                                                )}
                                            </TableCell>
                                        ) : null
                                    })}
                                </TableRow>
                            ))}
                        </>
                    )}
                </TableBody>
            </Table>
            {!loading && !error && !folders?.length && !documents?.length && (
                <Flex align="center" justify="center" style={{ marginTop: 20 }}>
                    <Typography.Text type="secondary">
                        No element found.
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
                        An error occured. <br />
                        {error}
                    </Typography.Text>
                </Flex>
            )}
        </div>
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
