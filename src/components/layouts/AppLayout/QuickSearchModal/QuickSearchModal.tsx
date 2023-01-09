import moment from "moment"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RiSearchLine as SearchIcon } from "react-icons/ri"
import DocumentLink from "src/components/editor/components/DocumentLink"
import Flex from "src/components/Flex"
import Input from "src/components/ui/Input"
import Loader from "src/components/ui/Loader"
import Modal from "src/components/ui/Modal"
import Typography from "src/components/ui/Typography"
import { useGetDocumentsQuery } from "src/services/documents"
import { useGetFoldersQuery } from "src/services/folders"
import { useAppDispatch, useAppSelector } from "src/store"
import { closeQuicksearch, openQuicksearch } from "src/store/ui"
import styled from "styled-components"

export default function QuickSearchModal() {
    const [query, setQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const resultListRef = useRef<HTMLDivElement>()

    const { quickSearchOpen } = useAppSelector((store) => store.ui)
    const dispatch = useAppDispatch()

    const { data: folders } = useGetFoldersQuery(null)

    const {
        data: documents,
        error: documentsError,
        isLoading: isLoadingDocuments
    } = useGetDocumentsQuery(null)

    const filteredDocuments = useMemo(
        () =>
            (documents || [])
                .filter(
                    (document) =>
                        !query ||
                        document.title
                            ?.toLowerCase()
                            .includes(query.toLowerCase()) ||
                        folders
                            ?.find((folder) => folder.id === document.folder)
                            ?.name.toLowerCase()
                            .includes(query.toLowerCase())
                )
                .sort(
                    (a, b) =>
                        new Date(b.updated_at).getTime() -
                        new Date(a.updated_at).getTime()
                ),
        [query, documents]
    )

    const closeModal = useCallback(() => {
        dispatch(closeQuicksearch())
    }, [dispatch])

    const openModal = useCallback(() => {
        dispatch(openQuicksearch())
    }, [dispatch])

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "p" && e.ctrlKey) {
                e.preventDefault()
                openModal()
            }

            if (!quickSearchOpen) {
                return
            }

            const documentCount = filteredDocuments.length
            if (e.key === "ArrowDown") {
                setSelectedIndex(
                    (prevValue) =>
                        (prevValue + 1 + documentCount) % documentCount
                )
            }

            if (e.key === "ArrowUp") {
                setSelectedIndex(
                    (prevValue) =>
                        (prevValue - 1 + documentCount) % documentCount
                )
            }

            if (e.key === "Enter") {
                ;(
                    resultListRef.current.querySelector(
                        'a[data-selected="true"]'
                    ) as HTMLElement
                ).click()
            }
        },
        [quickSearchOpen, filteredDocuments]
    )

    // Keydown handler
    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleKeyDown])

    // Auto scroll
    useEffect(() => {
        if (resultListRef.current) {
            const selectedItem = resultListRef.current.querySelector(
                '[data-selected="true"]'
            )

            if (selectedIndex === 0) {
                resultListRef.current.scrollTo({ top: 0, behavior: "smooth" })
            } else if (selectedItem) {
                const itemRect = selectedItem.getBoundingClientRect()
                const menuRect = resultListRef.current.getBoundingClientRect()

                if (itemRect.bottom > menuRect.bottom) {
                    resultListRef.current.scrollTo({
                        top:
                            itemRect.bottom -
                            menuRect.bottom +
                            resultListRef.current.scrollTop,
                        behavior: "smooth"
                    })
                } else if (itemRect.top < menuRect.top) {
                    resultListRef.current.scrollTo({
                        top:
                            itemRect.top -
                            menuRect.top +
                            resultListRef.current.scrollTop,
                        behavior: "smooth"
                    })
                }
            }
        }
    }, [selectedIndex])

    return (
        <Modal
            visible={quickSearchOpen}
            footer={null}
            onCancel={closeModal}
            onConfirm={closeModal}
            placement="top"
        >
            <Flex column gap={20}>
                <Input
                    size="large"
                    placeholder="Rechercher un document..."
                    icon={<SearchIcon />}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />

                {!!isLoadingDocuments && (
                    <Flex align="center" justify="center">
                        <Loader />
                    </Flex>
                )}
                {!!documentsError && (
                    <Flex align="center" justify="center">
                        <Typography.Text type="danger">
                            Une erreur est survenue.
                        </Typography.Text>
                    </Flex>
                )}

                <ResultList ref={resultListRef}>
                    {!filteredDocuments.length && (
                        <Flex align="center" justify="center">
                            <Typography.Text type="secondary">
                                Aucun document trouvé
                            </Typography.Text>
                        </Flex>
                    )}
                    {filteredDocuments.map((document, index) => (
                        <DocumentLink
                            key={index}
                            href={`/doc/${document.id}`}
                            title={document.title || "Sans titre"}
                            status={`${
                                folders?.find(
                                    (folder) => folder.id === document.folder
                                )?.name
                            } · Modifié le ${moment(
                                new Date(document.updated_at)
                            ).format("DD/MM/YYYY")} à ${moment(
                                new Date(document.updated_at)
                            ).format("HH:mm")}`}
                            style={{
                                backgroundColor:
                                    index === selectedIndex
                                        ? "var(--color-n100)"
                                        : undefined
                            }}
                            data-selected={index === selectedIndex}
                            onClick={() => {
                                closeModal()
                            }}
                        />
                    ))}
                </ResultList>
            </Flex>
        </Modal>
    )
}

const ResultList = styled.div`
    max-height: 400px;
    overflow-y: auto;
`
