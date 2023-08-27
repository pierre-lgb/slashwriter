"use client"

import { useLayoutEffect, useMemo, useState } from "react"
import FoldersDocumentsList from "src/components/FoldersDocumentsList"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Button from "src/components/ui/Button"
import Flex from "src/components/ui/Flex"
import Typography from "src/components/ui/Typography"
import stringifyDate from "src/utils/stringifyDate"

import styles from "./Shares.module.scss"

export default function Shares() {
    const [tab, setTab] = useState<"sharedWithUser" | "sharedByUser">(
        "sharedWithUser"
    )
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sharedDocuments, setSharedDocuments] = useState<any[]>([])

    const { supabaseClient } = useSupabase()

    useLayoutEffect(() => {
        setSharedDocuments([])
        setIsLoading(true)
        setError("")
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

    const columns = useMemo(
        () => [
            {
                label: "Title",
                sortable: true,
                field: "title",
                type: "string",
                getCellContent: (item) => {
                    return (
                        <Flex column>
                            <Typography.Text weight={500}>
                                {item.title.trim() || "Untitled"}
                            </Typography.Text>
                            <Typography.Text
                                type="secondary"
                                lineHeight="1.2rem"
                                small
                            >
                                {item.text_preview?.trim() || "Empty document"}
                            </Typography.Text>
                        </Flex>
                    )
                }
            },
            ...(tab === "sharedWithUser"
                ? [
                      {
                          label: "Shared by",
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
                                  {item.permission === "read" ? "Read" : "Edit"}
                              </Typography.Text>
                          )
                      }
                  ]
                : [
                      {
                          label: "Created",
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
                          label: "Visibility",
                          align: "right",
                          hideOnSmallScreens: true,
                          width: 100,
                          getCellContent: (item) => (
                              <Typography.Text type="secondary" small code>
                                  {item.public ? "Public" : "Private"}
                              </Typography.Text>
                          )
                      }
                  ])
        ],
        [tab]
    )

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Typography.Title level={3}>Shares</Typography.Title>

                <Flex auto column>
                    <Flex auto>
                        <Button
                            active={tab === "sharedWithUser"}
                            onClick={() => setTab("sharedWithUser")}
                            appearance="secondary"
                        >
                            Shared with me
                        </Button>
                        <Button
                            active={tab === "sharedByUser"}
                            onClick={() => setTab("sharedByUser")}
                            appearance="secondary"
                        >
                            My shares
                        </Button>
                    </Flex>

                    <FoldersDocumentsList
                        documents={sharedDocuments}
                        columns={columns}
                        loading={isLoading}
                        error={error}
                    />
                </Flex>
            </div>
        </div>
    )
}
