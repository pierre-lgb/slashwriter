import { createSlice } from '@reduxjs/toolkit'

interface NavigationState {
    /*
     * Whether the sidebar is open or not
     */
    sidebarOpen: boolean
}

const initialState: NavigationState = {
    sidebarOpen: true
}

export const uiSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen
        }
    }
})

export const { toggleSidebar } = uiSlice.actions

export default uiSlice.reducer
