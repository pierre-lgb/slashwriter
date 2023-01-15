import * as foldersApi from "src/api/folders"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Folder {
    id: string
    name: string
    parent_id: string
    color: string
    [x: string]: any
}

export interface FoldersState {
    folders: Folder[]
    isLoading: boolean
    error: string | null
}

const initialState: FoldersState = {
    folders: [],
    isLoading: false,
    error: null
}

export const foldersSlice = createSlice({
    name: "folders",
    initialState,
    reducers: {
        setFolders: (state, action: PayloadAction<Folder[]>) => {
            state.folders = action.payload
        },
        insertFolder: (state, action: PayloadAction<Folder>) => {
            state.folders = [...state.folders, action.payload]
        },
        updateFolder: (state, action: PayloadAction<Folder>) => {
            state.folders = state.folders.map((folder) =>
                folder.id === action.payload.id ? action.payload : folder
            )
        },
        deleteFolder: (state, action: PayloadAction<{ id: string }>) => {
            state.folders = state.folders.filter(
                (folder) => folder.id !== action.payload.id
            )
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(foldersApi.fetchFolders.fulfilled, (state, action) => {
                state.isLoading = false
                state.folders = action.payload
            })
            .addCase(foldersApi.fetchFolders.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(foldersApi.fetchFolders.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message
            })
    }
})

export const { setFolders, insertFolder, updateFolder, deleteFolder } =
    foldersSlice.actions

export default foldersSlice.reducer
