import { supabaseClient } from 'src/utils/supabase'

import baseApi from './'

function updateDocumentsCacheOnEvent(event, payload, draft) {
    switch (event) {
        case "INSERT":
            draft.push({
                id: payload.new.id,
                title: payload.new.title,
                folder: payload.new.folder,
                parent: payload.new.parent
            })
            break
        case "UPDATE":
            const oldDocument = draft.find((d) => d.id === payload.new.id)

            if (payload.new.deleted) {
                updateDocumentsCacheOnEvent("DELETE", payload, draft)
                return
            }

            Object.assign(oldDocument, {
                id: payload.new.id,
                title: payload.new.title,
                folder: payload.new.folder,
                parent: payload.new.parent
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
                console.log("Fetching document titles")
                const { data, error } = await supabaseClient
                    .from("documents")
                    .select("id, title, folder, parent")
                    .is("deleted", false)

                return data ? { data } : { error }
            },
            onCacheEntryAdded: async (
                _,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) => {
                await cacheDataLoaded

                const subscription = supabaseClient
                    .from("documents")
                    .on("*", (payload) => {
                        updateCachedData((draft) => {
                            updateDocumentsCacheOnEvent(
                                payload.eventType,
                                payload,
                                draft
                            )
                        })
                    })
                    .subscribe()

                await cacheEntryRemoved

                supabaseClient.removeSubscription(subscription)
            }
        }),
        addDocument: build.mutation<
            any,
            { title: string; folderId: string; parent?: string }
        >({
            queryFn: async ({ title, folderId, parent }) => {
                const { data, error } = await supabaseClient
                    .from("documents")
                    .insert({ title, folder: folderId, parent })

                return data ? { data } : { error }
            }
        }),
        renameDocument: build.mutation<any, { id: string; title: string }>({
            queryFn: async ({ id, title }) => {
                console.log("renaming document", id)
                const { data, error } = await supabaseClient
                    .from("documents")
                    .update({ title })
                    .match({ id })

                return data ? { data } : { error }
            }
        }),
        deleteDocument: build.mutation<any, { id: string }>({
            queryFn: async ({ id }) => {
                console.log("delete document", id)
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
                console.log("restore document", id)
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
