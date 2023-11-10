import { CommandersType } from "@/utils/types/commanders";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const top16API = createApi({
    reducerPath: 'commandersApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    endpoints: (builder) => ({
        getCommanders: builder.query<CommandersType, unknown>({
            query: (filters) => ({ url: 'commanders', method: "post", body: filters })
        })
    })
})

export const { useGetCommandersQuery } = top16API