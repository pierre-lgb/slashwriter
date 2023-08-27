import { createAsyncThunk } from "@reduxjs/toolkit"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

const supabaseClient = createPagesBrowserClient()

export const fetchDocuments = createAsyncThunk(
    "documents/fetch_all",
    async () => {
        const { data, error } = await supabaseClient
            .from("user_documents_tree")
            .select("*")

        if (error) {
            throw error
        }

        return data
    }
)

export const insertDocument = createAsyncThunk(
    "documents/insert",
    async (document: Record<string, any>) => {
        const { data, error } = await supabaseClient
            .from("documents")
            .insert(document)
            .select("id")
            .single()

        if (error) {
            throw error
        }

        return data
    }
)

export const updateDocument = createAsyncThunk(
    "documents/update",
    async ({ id, ...updates }: { id: string; [x: string]: any }) => {
        const { data, error } = await supabaseClient
            .from("documents")
            .update(updates)
            .match({ id })

        if (error) {
            throw error
        }

        return data
    }
)
