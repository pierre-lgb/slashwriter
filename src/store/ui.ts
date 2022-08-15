import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        changeTheme(theme) {}
    }
})

export default uiSlice.reducer
