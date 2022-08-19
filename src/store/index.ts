import { useDispatch, useSelector } from 'react-redux'
import api from 'src/services'

import { configureStore } from '@reduxjs/toolkit'

import navigationReducer from './navigation'
import uiReducer from './ui'

import type { TypedUseSelectorHook } from "react-redux"
const store = configureStore({
    reducer: {
        ui: uiReducer,
        [api.reducerPath]: api.reducer,
        navigation: navigationReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware)
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
