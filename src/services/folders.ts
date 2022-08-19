import { supabaseClient } from 'src/utils/supabase'

import baseApi from './'

function updateFoldersCacheOnEvent(event, payload, draft) {
    switch (event) {
        case "INSERT":
            draft.push({
                id: payload.new.id,
                name: payload.new.name,
                color: payload.new.color,
                created_at: payload.new.created_at
            })
            break
        case "UPDATE":
            const oldFolder = draft.find((f) => f.id === payload.new.id)

            if (payload.new.deleted) {
                updateFoldersCacheOnEvent("DELETE", payload, draft)
                return
            }

            if (!oldFolder) {
                updateFoldersCacheOnEvent("INSERT", payload, draft)
                return
            }

            Object.assign(oldFolder, {
                id: payload.new.id,
                name: payload.new.name,
                color: payload.new.color,
                created_at: payload.new.created_at
            })
            break
        case "DELETE":
            const index = draft.findIndex((f) => f.id === payload.old.id)
            if (index !== -1) draft.splice(index, 1)
            break
        default:
            return
    }
}

export const foldersApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getFolders: build.query<any, void>({
            queryFn: async () => {
                console.log("Fetching folders")
                const { data, error } = await supabaseClient
                    .from("folders")
                    .select("color, created_at, id, name")
                    .is("deleted", false)

                return data ? { data } : { error }
            },
            onCacheEntryAdded: async (
                _,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) => {
                await cacheDataLoaded

                const subscription = supabaseClient
                    .from("folders")
                    .on("*", (payload) => {
                        updateCachedData((draft) => {
                            updateFoldersCacheOnEvent(
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

        addFolder: build.mutation<any, { name: string; color?: string }>({
            queryFn: async ({ name, color }) => {
                const { data, error } = await supabaseClient
                    .from("folders")
                    .insert({ name })

                return data ? { data } : { error }
            }
        }),

        updateFolder: build.mutation<
            any,
            { id: string; update: { name?: string; color?: string } }
        >({
            queryFn: async ({ id, update }) => {
                const { data, error } = await supabaseClient
                    .from("folders")
                    .update(update)
                    .match({ id })

                return data ? { data } : { error }
            }
        }),

        deleteFolder: build.mutation<any, { id: string }>({
            queryFn: async ({ id }) => {
                const { data, error } = await supabaseClient
                    .from("folders")
                    .update({ deleted: true })
                    .match({ id })

                return data ? { data } : { error }
            }
        }),

        restoreFolder: build.mutation<any, { id: string }>({
            queryFn: async ({ id }) => {
                const { data, error } = await supabaseClient
                    .from("folders")
                    .update({ deleted: false })
                    .match({ id })

                return data ? { data } : { error }
            }
        })
    })
})

export const {
    useGetFoldersQuery,
    useAddFolderMutation,
    useUpdateFolderMutation,
    useDeleteFolderMutation,
    useRestoreFolderMutation
} = foldersApi
