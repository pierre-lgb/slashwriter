import { createSlice } from "@reduxjs/toolkit"

interface NavigationState {
    /*
     * The currently active document (`null` if no document is open)
     */
    activeDocumentId: string | null

    /*
     * The currently active folder (`null` if no folder or document is open)
     */
    activeFolderId: string | null
}

const initialState: NavigationState = {
    activeDocumentId: null,
    activeFolderId: null
}

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setActiveDocumentId(state, action: { payload: string | null }) {
            state.activeDocumentId = action.payload
        },
        setActiveFolderId(state, action: { payload: string | null }) {
            state.activeFolderId = action.payload
        }
    }
})

export const { setActiveDocumentId, setActiveFolderId } =
    navigationSlice.actions

export default navigationSlice.reducer
