import { supabaseClient } from 'src/utils/supabase'

import baseApi from './'

export const foldersApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getFolders: build.query<any, void>({
            queryFn: async () => {
                console.log("Fetching folders")
                const { data, error } = await supabaseClient
                    .from("folders")
                    .select("color, created_at, id, name")

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
                            switch (payload.eventType) {
                                case "INSERT":
                                    delete payload.new.user_id
                                    draft.push(payload.new)
                                    break
                                case "UPDATE":
                                    const oldFolder = draft.find(
                                        (f) => f.id === payload.new.id
                                    )
                                    delete payload.new.user_id
                                    Object.assign(oldFolder, payload.new)
                                    break
                                case "DELETE":
                                    const index = draft.findIndex(
                                        (f) => f.id === payload.old.id
                                    )
                                    if (index !== -1) draft.splice(index, 1)
                                    break
                                default:
                                    return
                            }
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
                    .delete()
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
    useDeleteFolderMutation
} = foldersApi
