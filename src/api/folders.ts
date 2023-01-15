import { supabaseClient } from "src/utils/supabase"

import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchFolders = createAsyncThunk("folders/fetch_all", async () => {
    const { data, error } = await supabaseClient
        .from("user_folders_tree")
        .select("*")

    if (error) {
        throw error
    }

    return data
})

export const insertFolder = createAsyncThunk(
    "folders/insert",
    async (folder: Record<string, any>) => {
        const { data, error } = await supabaseClient
            .from("folders")
            .insert(folder)

        if (error) {
            throw error
        }

        return data
    }
)

export const updateFolder = createAsyncThunk(
    "folders/update",
    async ({ id, ...updates }: { id: string; [x: string]: any }) => {
        const { data, error } = await supabaseClient
            .from("folders")
            .update(updates)
            .match({ id })

        if (error) {
            throw error
        }

        return data
    }
)
