import { useEffect, useMemo, useState } from "react"
import { RiHome2Line as HomeIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import FoldersDocumentsList from "src/components/FoldersDocumentsList"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"
import stringifyDate from "src/utils/stringifyDate"
import { supabaseClient, useUser, withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

export default function Home() {
    const user = useUser()

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
            label: "Titre",
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
            label: "Modifié le",
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
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title level={3}>Accueil</Typography.Title>
                    <FoldersDocumentsList
                        folders={recentFolders || []}
                        documents={recentDocuments || []}
                        columns={columns}
                        loading={isLoadingDocuments || isLoadingFolders}
                        foldersLabel="Dossiers récents"
                        documentsLabel="Documents récents"
                    />
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Home.Layout = AppLayout
Home.Title = "Accueil"
Home.Icon = <HomeIcon />

const Container = styled.div`
    padding: 50px 25px;
`

const Content = styled.div`
    margin: 25px auto;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
`

export const getServerSideProps = withPageAuth()
