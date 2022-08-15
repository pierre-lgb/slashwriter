import { configureStore } from '@reduxjs/toolkit'

import uiReducer from './ui'

const store = configureStore({
    reducer: {
        ui: uiReducer
        // [api.reducerPath]: api.reducer
        // folders: foldersReducer
    }
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(api.middleware)
})

export default store
