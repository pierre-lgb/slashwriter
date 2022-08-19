import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

const api = createApi({
    baseQuery: fakeBaseQuery(),
    endpoints: () => ({})
})

export default api