import moment from "moment"
import { useEffect, useState } from "react"
import { RiShareForwardLine as ShareIcon } from "react-icons/ri"
import DocumentLink from "src/components/editor/components/DocumentLink"
import Flex from "src/components/Flex"
import AppLayout from "src/components/layouts/AppLayout"
import Separator from "src/components/Separator"
import TransitionOpacity from "src/components/TransitionOpacity"
import Button from "src/components/ui/Button"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"
import { supabaseClient, withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

function Shares() {
    const [tab, setTab] = useState("sharedWithUser")
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [sharedDocuments, setSharedDocuments] = useState([])

    const { folders } = useAppSelector((state) => state.folders)
    console.log(sharedDocuments)
    useEffect(() => {
        setIsLoading(true)
        supabaseClient
            .from(
                tab === "sharedWithUser"
                    ? "documents_shared_with_user"
                    : "documents_shared_by_user"
            )
            .select("*")
            .then(({ data, error }) => {
                if (data) {
                    setSharedDocuments(data)
                } else {
                    console.error(error)
                    setIsError(true)
                }
                setIsLoading(false)
            })
    }, [tab])

    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title>Partages</Typography.Title>

                    <Flex auto column>
                        <Flex auto gap={10}>
                            <Button
                                active={tab === "sharedWithUser"}
                                onClick={() => setTab("sharedWithUser")}
                                appearance="text"
                            >
                                Partagé avec moi
                            </Button>
                            <Button
                                active={tab === "sharedByUser"}
                                onClick={() => setTab("sharedByUser")}
                                appearance="text"
                            >
                                Mes partages
                            </Button>
                        </Flex>
                        <Separator />
                        {isLoading && (
                            <Flex
                                align="center"
                                justify="center"
                                style={{ marginTop: 20 }}
                            >
                                <Loader />
                            </Flex>
                        )}

                        {isError && (
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

                        {!isLoading && !sharedDocuments.length && (
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

                        {!isLoading &&
                            sharedDocuments.map((document, index) =>
                                tab === "sharedWithUser" ? (
                                    <DocumentLink
                                        title={document.title || "Sans titre"}
                                        href={`/doc/${document.id}`}
                                        status={`Partagé par ${document.owner_username} (${document.owner_email})`}
                                        badge={
                                            document.permission === "read"
                                                ? "Lecteur"
                                                : "Éditeur"
                                        }
                                        key={index}
                                    />
                                ) : (
                                    <DocumentLink
                                        title={document.title || "Sans titre"}
                                        href={`/doc/${document.id}`}
                                        status={`
                                        ${
                                            folders?.find(
                                                (folder) =>
                                                    folder.id ===
                                                    document.folder_id
                                            )?.name
                                        } · Partagé le ${moment(
                                            new Date(document.share_created_at)
                                        ).format("DD/MM/YYYY")} à ${moment(
                                            new Date(document.share_created_at)
                                        ).format("HH:mm")}
                                        `}
                                        badge={
                                            document.public ? "Public" : null
                                        }
                                        key={index}
                                    />
                                )
                            )}
                    </Flex>
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Shares.Layout = AppLayout
Shares.Title = "Partages"
Shares.Icon = <ShareIcon />

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

export default Shares
