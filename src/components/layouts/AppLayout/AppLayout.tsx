import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { fetchDocuments } from "src/api/documents"
import { fetchFolders } from "src/api/folders"
import Flex from "src/components/Flex"
import { useAppDispatch } from "src/store"
import * as documentsStore from "src/store/documents"
import * as foldersStore from "src/store/folders"
import { supabaseClient } from "src/utils/supabase"
import styled from "styled-components"

import { useUser } from "@supabase/auth-helpers-react"
import { RealtimeChannel } from "@supabase/supabase-js"

import Header from "./Header"
import QuickSearchModal from "./QuickSearchModal"
import Sidebar from "./Sidebar"

function AppLayout(props) {
    const user = useUser()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const realtimeChannelRef = useRef<RealtimeChannel>(null)

    useEffect(() => {
        if (!user && router.route !== "/doc/[docId]") {
            router.push("/auth")
        }
    }, [user, router])

    useEffect(() => {
        if (user) {
            dispatch(fetchFolders())
            dispatch(fetchDocuments())

            // Subscribe to realtime updates
            const realtimeChannel = supabaseClient.channel("db-changes")

            const realtimeEventHandlers = [
                {
                    event: "document.INSERT",
                    handler: (payload) => {
                        console.log("document.INSERT", payload)
                        dispatch(documentsStore.insertDocument(payload.data))
                    }
                },
                {
                    event: "document.UPDATE",
                    handler: (payload) => {
                        console.log("document.UPDATE", payload)
                        dispatch(documentsStore.updateDocument(payload.data))
                    }
                },
                {
                    event: "document.DELETE",
                    handler: (payload) => {
                        console.log("document.DELETE", payload)
                        dispatch(documentsStore.deleteDocument(payload.data))
                    }
                },
                {
                    event: "folder.INSERT",
                    handler: (payload) => {
                        console.log("folder.INSERT", payload)
                        dispatch(foldersStore.insertFolder(payload.data))
                    }
                },
                {
                    event: "folder.UPDATE",
                    handler: (payload) => {
                        console.log("folder.UPDATE", payload)
                        dispatch(foldersStore.updateFolder(payload.data))
                    }
                },
                {
                    event: "folder.DELETE",
                    handler: (payload) => {
                        console.log("folder.DELETE", payload)
                        dispatch(foldersStore.deleteFolder(payload.data))
                    }
                }
            ]

            realtimeEventHandlers.forEach(({ event, handler }) => {
                realtimeChannel.on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "realtime_events",
                        filter: `event_type=eq.${event}`
                    },
                    (payload) => {
                        handler(payload.new)
                    }
                )
            })

            realtimeChannel.subscribe()
            realtimeChannelRef.current = realtimeChannel
        }

        return () => {
            dispatch(documentsStore.setDocuments([]))
            dispatch(foldersStore.setFolders([]))

            // Unsubscribe from realtime updates
            if (realtimeChannelRef.current) {
                supabaseClient.removeChannel(realtimeChannelRef.current)
                realtimeChannelRef.current = null
            }
        }
    }, [!!user])

    return (
        <>
            <Container>
                <Sidebar />
                <Main>
                    <Header pageTitle={props.title} pageIcon={props.icon} />
                    <PageContent>{props.children}</PageContent>
                </Main>
                {user && <QuickSearchModal />}
            </Container>
        </>
    )
}

const Container = styled(Flex)`
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    @media print {
        .sidebar {
            display: none;
        }

        .header {
            display: none;
        }
    }
`

const Main = styled.main`
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    width: 100%;
    overflow: hidden;

    @media print {
        display: block;
        max-height: unset;
    }
`

const PageContent = styled.div`
    overflow-y: auto;
    width: 100%;
    height: 100%;

    @media print {
        overflow-y: hidden;
    }
`

export default AppLayout
