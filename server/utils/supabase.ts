import { createClient, SupabaseClient } from "@supabase/supabase-js"

export const getSupabaseClient = async (token?: {
    access_token: string
    refresh_token: string
}): Promise<SupabaseClient | null> => {
    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        {
            auth: {
                autoRefreshToken: false,
                detectSessionInUrl: false,
                persistSession: false
            }
        }
    )

    if (token) {
        const { refresh_token, access_token } = token
        const res = await supabaseClient.auth.setSession({
            refresh_token,
            access_token
        })

        if (res.error) {
            return null
        }
    }

    return supabaseClient
}
