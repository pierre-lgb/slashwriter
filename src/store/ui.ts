import { createSlice } from "@reduxjs/toolkit"

interface NavigationState {
    sidebarOpen: boolean
    mobileSidebarOpen: boolean
    quickSearchOpen: boolean
}

const initialState: NavigationState = {
    sidebarOpen: true,
    mobileSidebarOpen: false,
    quickSearchOpen: false
}

export const uiSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        // Sidebar
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen
        },
        toggleMobileSidebar(state) {
            state.mobileSidebarOpen = !state.mobileSidebarOpen
        },
        closeMobileSidebar(state) {
            state.mobileSidebarOpen = false
        },

        // Quicksearch
        openQuicksearch(state) {
            state.quickSearchOpen = true
        },

        closeQuicksearch(state) {
            state.quickSearchOpen = false
        }
    }
})

export const {
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
    openQuicksearch,
    closeQuicksearch
} = uiSlice.actions

export default uiSlice.reducer
