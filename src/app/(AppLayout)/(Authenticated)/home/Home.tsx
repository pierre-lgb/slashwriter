"use client"

import { useEffect, useMemo, useState } from "react"
import FoldersDocumentsList from "src/components/FoldersDocumentsList"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Flex from "src/components/ui/Flex"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"
import stringifyDate from "src/utils/stringifyDate"

import styles from "./Home.module.scss"

export default function Home() {
    const { supabaseClient } = useSupabase()

    const {
        documents,
        isLoading: isLoadingDocuments,
        error: documentsError
    } = useAppSelector((state) => state.documents)

    const {
        folders,
        isLoading: isLoadingFolders,
        error: foldersError
    } = useAppSelector((state) => state.folders)

    const [textPreviews, setTextPreviews] = useState({})
    const [loadingTextPreviews, setLoadingTextPreviews] = useState(true)

    const recentFolders = useMemo(() => {
        return [...folders]
            .sort(
                (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
            )
            .slice(0, 5)
    }, [folders])

    const recentDocuments = useMemo(() => {
        return [...documents]
            .sort(
                (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
            )
            .slice(0, 10)
    }, [documents])

    useEffect(() => {
        if (documents.length) {
            setLoadingTextPreviews(true)

            supabaseClient
                .from("documents")
                .select("id, text_preview")
                .in(
                    "id",
                    recentDocuments.map((d) => d.id)
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
    }, [documents])

    const columns = [
        {
            label: "Title",
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
            align: "right",
            width: "30%",
            hideOnSmallScreens: true,
            getCellContent: (item) => (
                <Typography.Text type="secondary" small>
                    {stringifyDate(item.updated_at)}
                </Typography.Text>
            )
        }
    ]

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Typography.Title level={3}>Home</Typography.Title>
                <FoldersDocumentsList
                    folders={recentFolders || []}
                    documents={recentDocuments || []}
                    columns={columns}
                    loading={isLoadingDocuments || isLoadingFolders}
                    foldersLabel="Recent folders"
                    documentsLabel="Recent documents"
                />
            </div>
        </div>
    )
}
