import moment from "moment"
import { useEffect, useState } from "react"
import { RiShareForwardLine as ShareIcon } from "react-icons/ri"
import DocumentLink from "src/components/DocumentLink"
import Flex from "src/components/Flex"
import FoldersDocumentsList from "src/components/FoldersDocumentsList"
import AppLayout from "src/components/layouts/AppLayout"
import Separator from "src/components/Separator"
import TransitionOpacity from "src/components/TransitionOpacity"
import Button from "src/components/ui/Button"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"
import stringifyDate from "src/utils/stringifyDate"
import { supabaseClient, withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

function Shares() {
    const [tab, setTab] = useState("sharedWithUser")
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [sharedDocuments, setSharedDocuments] = useState([])

    useEffect(() => {
        setIsLoading(true)
        setError(null)
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
                    setError(error.message)
                }
                setIsLoading(false)
            })
    }, [tab])

    const columns = [
        {
            label: "Titre",
            sortable: true,
            field: "title",
            type: "string",
            getCellContent: (item) => {
                return (
                    <Flex column>
                        <Typography.Text weight={500}>
                            {item.title.trim() || "Sans titre"}
                        </Typography.Text>
                        <Typography.Text
                            type="secondary"
                            lineHeight={1.2}
                            small
                        >
                            {item.text_preview?.trim() || "Document vide"}
                        </Typography.Text>
                    </Flex>
                )
            }
        },
        ...(tab === "sharedWithUser"
            ? [
                  {
                      label: "Partagé par",
                      sortable: true,
                      field: "owner_email",
                      type: "string",
                      align: "right",
                      width: "30%",
                      hideOnSmallScreens: true,
                      getCellContent: (item) => (
                          <Typography.Text type="secondary" small>
                              {item.owner_email}
                          </Typography.Text>
                      )
                  },
                  {
                      label: "Permission",
                      align: "right",
                      width: 100,
                      hideOnSmallScreens: true,
                      getCellContent: (item) => (
                          <Typography.Text type="secondary" small code>
                              {item.permission === "read" ? "Lire" : "Modifier"}
                          </Typography.Text>
                      )
                  }
              ]
            : [
                  {
                      label: "Partagé le",
                      sortable: true,
                      field: "share_created_at",
                      type: "date",
                      align: "right",
                      width: "30%",
                      hideOnSmallScreens: true,
                      getCellContent: (item) => (
                          <Typography.Text type="secondary" small>
                              {stringifyDate(item.share_created_at)}
                          </Typography.Text>
                      )
                  },
                  {
                      label: "Statut",
                      align: "right",
                      hideOnSmallScreens: true,
                      width: 100,
                      getCellContent: (item) => (
                          <Typography.Text type="secondary" small code>
                              {item.public ? "Public" : "Privé"}
                          </Typography.Text>
                      )
                  }
              ])
    ]

    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title level={3}>Partages</Typography.Title>

                    <Flex auto column>
                        <Flex auto>
                            <Button
                                active={tab === "sharedWithUser"}
                                onClick={() => setTab("sharedWithUser")}
                                appearance="secondary"
                            >
                                Partagé avec moi
                            </Button>
                            <Button
                                active={tab === "sharedByUser"}
                                onClick={() => setTab("sharedByUser")}
                                appearance="secondary"
                            >
                                Mes partages
                            </Button>
                        </Flex>

                        <FoldersDocumentsList
                            documents={sharedDocuments}
                            columns={columns}
                            loading={isLoading}
                            error={error}
                        />
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
    padding: 50px 25px;
`

const Content = styled.div`
    margin: 25px auto;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`

export const getServerSideProps = withPageAuth()

export default Shares
