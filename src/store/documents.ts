import * as documentsApi from "src/api/documents"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Document {
    id: string
    title: string
    folder_id: string
    parent_id: string | null
    favorite: boolean
    updated_at: string
}

export interface DocumentsState {
    documents: Document[]
    isLoading: boolean
    error: string | null
}

const initialState: DocumentsState = {
    documents: [],
    isLoading: false,
    error: null
}

export const documentsSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        setDocuments: (state, action: PayloadAction<Document[]>) => {
            state.documents = action.payload
        },
        insertDocument: (state, action: PayloadAction<Document>) => {
            state.documents = [...state.documents, action.payload]
        },
        updateDocument: (state, action: PayloadAction<Document>) => {
            state.documents = state.documents.map((document) =>
                document.id === action.payload.id ? action.payload : document
            )
        },
        deleteDocument: (state, action: PayloadAction<{ id: string }>) => {
            state.documents = state.documents.filter(
                (document) => document.id !== action.payload.id
            )
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(documentsApi.fetchDocuments.fulfilled, (state, action) => {
                state.isLoading = false
                state.documents = action.payload
            })
            .addCase(documentsApi.fetchDocuments.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(documentsApi.fetchDocuments.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message ?? null
            })
    }
})

export const { setDocuments, insertDocument, updateDocument, deleteDocument } =
    documentsSlice.actions

export default documentsSlice.reducer
