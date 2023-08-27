import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export default async function AuthenticatedLayout({
    children
}: {
    children: React.ReactNode
}) {
    const supabase = createServerComponentClient({ cookies })

    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/auth/sign-in")
    }

    return <>{children}</>
}
