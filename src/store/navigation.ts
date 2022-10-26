import { createSlice } from "@reduxjs/toolkit"

interface NavigationState {
    /*
     * The currently active document (`null` if no document is open)
     */
    activeDocument: string | null

    /*
     * The currently active folder (`null` if no folder or document is open)
     */
    activeFolder: string | null
}

const initialState: NavigationState = {
    activeDocument: null,
    activeFolder: null
}

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setActiveDocument(state, action: { payload: string | null }) {
            state.activeDocument = action.payload
        },
        setActiveFolder(state, action: { payload: string | null }) {
            state.activeFolder = action.payload
        }
    }
})

export const { setActiveDocument, setActiveFolder } = navigationSlice.actions

export default navigationSlice.reducer
