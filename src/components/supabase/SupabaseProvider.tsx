"use client"

import { createContext, useContext, useState } from "react"

import {
    createPagesBrowserClient,
    Session,
    SupabaseClient
} from "@supabase/auth-helpers-nextjs"

type MaybeSession = Session | null

type SupabaseContext = {
    supabaseClient: SupabaseClient
    session: MaybeSession
}

// @ts-ignore
const Context = createContext<SupabaseContext>()

export default function SupabaseProvider({
    children,
    session
}: {
    children: React.ReactNode
    session: MaybeSession
}) {
    const [supabaseClient] = useState(() => createPagesBrowserClient())

    return (
        <Context.Provider value={{ supabaseClient, session }}>
            <>{children}</>
        </Context.Provider>
    )
}

export const useSupabase = () => useContext(Context)
