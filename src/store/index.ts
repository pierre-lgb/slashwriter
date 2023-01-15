import { useDispatch, useSelector } from "react-redux"

import { configureStore } from "@reduxjs/toolkit"

import documentsReducer from "./documents"
import foldersReducer from "./folders"
import uiReducer from "./ui"

import type { TypedUseSelectorHook } from "react-redux"
const store = configureStore({
    reducer: {
        ui: uiReducer,
        documents: documentsReducer,
        folders: foldersReducer
    }
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
