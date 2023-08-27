"use client"

import moment from "moment"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RiSearchLine as SearchIcon } from "react-icons/ri"
import DocumentLink from "src/components/DocumentLink"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Flex from "src/components/ui/Flex"
import Input from "src/components/ui/Input"
import Loader from "src/components/ui/Loader"
import Modal from "src/components/ui/Modal"
import Typography from "src/components/ui/Typography"
import { useAppDispatch, useAppSelector } from "src/store"
import { closeQuicksearch, openQuicksearch } from "src/store/ui"

import styles from "./QuickSearchModal.module.scss"

export default function QuickSearchModal() {
    const { session } = useSupabase()

    const [query, setQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const resultListRef = useRef<HTMLDivElement | null>(null)

    const { quickSearchOpen } = useAppSelector((store) => store.ui)
    const dispatch = useAppDispatch()

    const {
        documents,
        isLoading: isLoadingDocuments,
        error: documentsError
    } = useAppSelector((store) => store.documents)

    const {
        folders,
        isLoading: isLoadingFolders,
        error: foldersError
    } = useAppSelector((store) => store.folders)

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
                            ?.find((folder) => folder.id === document.folder_id)
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
            // Ctrl + P
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
                const selectedItem = resultListRef.current?.querySelector(
                    'a[data-selected="true"]'
                ) as HTMLAnchorElement
                selectedItem.click()
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

    return session ? (
        <Modal
            visible={quickSearchOpen}
            footer={null}
            onCancel={closeModal}
            onConfirm={closeModal}
            placement="center"
            padding="1rem"
        >
            <Flex column gap={20}>
                <Input
                    size="large"
                    placeholder="Search something..."
                    icon={<SearchIcon />}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />

                {!!(isLoadingDocuments || isLoadingFolders) && (
                    <Flex align="center" justify="center">
                        <Loader />
                    </Flex>
                )}
                {!!(documentsError || foldersError) && (
                    <Flex align="center" justify="center">
                        <Typography.Text type="danger">
                            Une erreur est survenue.
                        </Typography.Text>
                    </Flex>
                )}

                <div className={styles.resultList} ref={resultListRef}>
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
                                    (folder) => folder.id === document.folder_id
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
                </div>
            </Flex>
        </Modal>
    ) : null
}
