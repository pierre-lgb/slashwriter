import { createSlice } from '@reduxjs/toolkit'

interface NavigationState {
    /*
     * The currently active document (`null` if no document is open)
     */
    currentDocument: {
        id: string
        title: string | null
    }
    /*
     * The currently active folder (`null` if no folder or document is open)
     */
    currentFolder: {
        id: string
        name: string | null
    }
}

const initialState: NavigationState = {
    currentDocument: null,
    currentFolder: null
}

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setCurrentDocument(state, action) {
            state.currentDocument = action.payload
        },
        setCurrentFolder(state, action) {
            state.currentFolder = action.payload
        }
    }
})

export const { setCurrentDocument, setCurrentFolder } = navigationSlice.actions

export default navigationSlice.reducer
