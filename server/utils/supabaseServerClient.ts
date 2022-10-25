import { supabaseClient } from "@supabase/auth-helpers-nextjs"

const supabaseServerClient = (accessToken?: string) => {
    supabaseClient.auth.setAuth(accessToken)
    return supabaseClient
}

export default supabaseServerClient
