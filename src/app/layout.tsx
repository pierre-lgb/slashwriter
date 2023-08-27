import "src/styles/global.scss"
import "tippy.js/dist/tippy.css"
import "tippy.js/themes/light-border.css"
import "tippy.js/animations/shift-away.css"
import "tippy.js/animations/scale-subtle.css"

import { Metadata } from "next"
import { cookies } from "next/headers"
import StoreProvider from "src/components/StoreProvider"
import SupabaseListener from "src/components/supabase/SupabaseListener"
import SupabaseProvider from "src/components/supabase/SupabaseProvider"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import RealtimeEventsListener from "./RealtimeEventsListener"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Slashwriter",
    description:
        "Slashwriter is a tool for creating, organizing, and sharing documents online. Its block-based collaborative editor, which is easy to use, is designed to help you create high-quality documents while saving you time."
}

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const supabase = createServerComponentClient({ cookies })

    const {
        data: { session }
    } = await supabase.auth.getSession()

    return (
        <html lang="en">
            <head />
            <body>
                <SupabaseProvider session={session}>
                    <SupabaseListener
                        serverAccessToken={session?.access_token}
                    />
                    <StoreProvider>
                        {session && <RealtimeEventsListener />}
                        {children}
                    </StoreProvider>
                </SupabaseProvider>
            </body>
        </html>
    )
}
