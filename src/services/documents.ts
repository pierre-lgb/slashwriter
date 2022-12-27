import { supabaseClient } from "src/utils/supabase"

import baseApi from "./"

function updateDocumentsCacheOnEvent(event, payload, draft) {
    switch (event) {
        case "INSERT":
            draft.push({
                id: payload.new.id,
                title: payload.new.title,
                folder: payload.new.folder,
                parent: payload.new.parent,
                updated_at: payload.new.updated_at
            })
            break
        case "UPDATE":
            const oldDocument = draft.find((d) => d.id === payload.new.id)

            if (payload.new.deleted) {
                updateDocumentsCacheOnEvent("DELETE", payload, draft)
                return
            }

            if (!oldDocument) return

            Object.assign(oldDocument, {
                id: payload.new.id,
                title: payload.new.title,
                folder: payload.new.folder,
                parent: payload.new.parent,
                updated_at: payload.new.updated_at
            })
            break
        case "DELETE":
            const index = draft.findIndex((d) => d.id === payload.old.id)
            if (index !== -1) draft.splice(index, 1)
            break
        default:
            return
    }
}

export const documentsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getDocuments: build.query<any, void>({
            queryFn: async () => {
                console.log("Fetching documents")
                const session = await supabaseClient.auth.getSession()
                const user = session.data.session.user

                const { data, error } = await supabaseClient
                    .from("documents")
                    .select("id, title, folder, parent, updated_at")
                    .is("deleted", false)
                    .match({ user_id: user.id })

                return data ? { data } : { error }
            },
            onCacheEntryAdded: async (
                _,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) => {
                await cacheDataLoaded

                const session = await supabaseClient.auth.getSession()
                const user = session.data.session.user

                // const subscription = supabaseClient
                //     // .from("documents")
                //     .from(`documents:user_id=eq.${user.id}`)
                //     .on("*", (payload) => {
                //         updateCachedData((draft) => {
                //             updateDocumentsCacheOnEvent(
                //                 payload.eventType,
                //                 payload,
                //                 draft
                //             )
                //         })
                //     })

                //     .subscribe()

                const subscription = supabaseClient
                    .channel("document_updates")
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "documents",
                            filter: `user_id=eq.${user.id}`
                        },
                        (payload) => {
                            updateCachedData((draft) => {
                                updateDocumentsCacheOnEvent(
                                    payload.eventType,
                                    payload,
                                    draft
                                )
                            })
                        }
                    )
                    .subscribe()

                await cacheEntryRemoved

                subscription.unsubscribe()
            }
        }),
        addDocument: build.mutation<any, { folderId: string; parent?: string }>(
            {
                queryFn: async ({ folderId, parent }) => {
                    const { data, error } = await supabaseClient
                        .from("documents")
                        .insert({ title: "", folder: folderId, parent })
                        .select("id")

                    return data ? { data } : { error }
                }
            }
        ),
        renameDocument: build.mutation<any, { id: string; title: string }>({
            queryFn: async ({ id, title }) => {
                console.log("Renaming document", id)
                const { data, error } = await supabaseClient
                    .from("documents")
                    .update({ title })
                    .match({ id })

                return data ? { data } : { error }
            }
        }),
        deleteDocument: build.mutation<any, { id: string }>({
            queryFn: async ({ id }) => {
                console.log("Deleting document", id)
                const { data, error } = await supabaseClient
                    .from("documents")
                    .update({
                        deleted: true
                    })
                    .match({ id })

                return data ? { data } : { error }
            }
        }),
        restoreDocument: build.mutation<any, { id: string }>({
            queryFn: async ({ id }) => {
                console.log("Restoring document", id)
                const { data, error } = await supabaseClient
                    .from("documents")
                    .update({
                        deleted: false
                    })
                    .match({ id })

                return data ? { data } : { error }
            }
        })
    })
})

export const {
    useGetDocumentsQuery,
    useRenameDocumentMutation,
    useDeleteDocumentMutation,
    useRestoreDocumentMutation,
    useAddDocumentMutation
} = documentsApi
