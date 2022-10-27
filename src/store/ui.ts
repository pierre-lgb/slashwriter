import { createSlice } from "@reduxjs/toolkit"

interface NavigationState {
    sidebarOpen: boolean
    mobileSidebarOpen: boolean
}

const initialState: NavigationState = {
    sidebarOpen: true,
    mobileSidebarOpen: false
}

export const uiSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen
        },
        toggleMobileSidebar(state) {
            state.mobileSidebarOpen = !state.mobileSidebarOpen
        },
        hideMobileSidebar(state) {
            state.mobileSidebarOpen = false
        }
    }
})

export const { toggleSidebar, toggleMobileSidebar, hideMobileSidebar } =
    uiSlice.actions

export default uiSlice.reducer
