import moment from "moment"
import { RiDislikeLine as FavoriteRemoveIcon, RiHeartLine as FavoriteIcon } from "react-icons/ri"
import DocumentLink from "src/components/editor/components/DocumentLink"
import Flex from "src/components/Flex"
import AppLayout from "src/components/layouts/AppLayout"
import Separator from "src/components/Separator"
import TransitionOpacity from "src/components/TransitionOpacity"
import Button from "src/components/ui/Button"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useGetDocumentsQuery, useUpdateDocumentMutation } from "src/services/documents"
import { useGetFoldersQuery } from "src/services/folders"
import { withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import Tippy from "@tippyjs/react"

function Favorites() {
    const [updateDocument] = useUpdateDocumentMutation()

    const { data: folders } = useGetFoldersQuery(null)

    const { favorites, isLoading, isError } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            favorites: data?.filter((d) => d.favorite),
            isLoading,
            isError
        })
    })

    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title>Favoris</Typography.Title>
                    <Flex auto column>
                        <Separator />
                        {!!isLoading && (
                            <Flex
                                align="center"
                                justify="center"
                                style={{ marginTop: 20 }}
                            >
                                <Loader />
                            </Flex>
                        )}

                        {!!isError && (
                            <Flex
                                align="center"
                                justify="center"
                                style={{ marginTop: 20 }}
                            >
                                <Typography.Text type="danger">
                                    Une erreur est survenue.
                                </Typography.Text>
                            </Flex>
                        )}

                        {!favorites.length && (
                            <Flex
                                align="center"
                                justify="center"
                                style={{ marginTop: 20 }}
                            >
                                <Typography.Text type="secondary">
                                    Aucun élement à afficher.
                                </Typography.Text>
                            </Flex>
                        )}

                        {(favorites || []).map((document, index) => (
                            <DocumentLink
                                title={document.title || "Sans titre"}
                                href={`/shared/${document.id}`}
                                status={`${
                                    folders?.find(
                                        (folder) =>
                                            folder.id === document.folder
                                    )?.name
                                } · Modifié le ${moment(
                                    new Date(document.updated_at)
                                ).format("DD/MM/YYYY")} à ${moment(
                                    new Date(document.updated_at)
                                ).format("HH:mm")}`}
                                actions={
                                    <Tippy
                                        content="Retirer des favoris"
                                        arrow={false}
                                        placement="bottom"
                                    >
                                        <Button
                                            appearance="text"
                                            icon={<FavoriteRemoveIcon />}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                updateDocument({
                                                    id: document.id,
                                                    update: {
                                                        favorite: false
                                                    }
                                                })
                                            }}
                                        />
                                    </Tippy>
                                }
                                key={index}
                            />
                        ))}
                    </Flex>
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Favorites.Layout = AppLayout
Favorites.Title = "Favoris"
Favorites.Icon = <FavoriteIcon />

const Container = styled.div`
    padding: 100px 25px;
`

const Content = styled.div`
    margin: 25px auto;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`

export const getServerSideProps = withPageAuth()

export default Favorites
