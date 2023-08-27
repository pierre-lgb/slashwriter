"use client"

import { useEffect, useRef } from "react"
import { fetchDocuments } from "src/api/documents"
import { fetchFolders } from "src/api/folders"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import { useAppDispatch } from "src/store"
import * as documentsStore from "src/store/documents"
import * as foldersStore from "src/store/folders"

import { RealtimeChannel } from "@supabase/supabase-js"

export default function RealtimeEventsListener() {
    const { session, supabaseClient } = useSupabase()
    const dispatch = useAppDispatch()

    const realtimeChannelRef = useRef<RealtimeChannel | null>(null)

    useEffect(() => {
        if (session?.user) {
            // Initial fetch
            console.log("Fetching folders & documents")
            dispatch(fetchFolders())
            dispatch(fetchDocuments())

            // Subscribe to realtime events
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

            const realtimeChannel = supabaseClient.channel("db-changes")

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
    }, [session])

    return null
}
