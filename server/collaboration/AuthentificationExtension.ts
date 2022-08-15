import * as cookie from 'cookie'

import { Extension, onAuthenticatePayload } from '@hocuspocus/server'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'

import { supabaseServerClient } from '../utils'

export default class AuthenticationExtension implements Extension {
    async onAuthenticate({ documentName, connection, requestHeaders }: onAuthenticatePayload) {
        const cookies = cookie.parse(requestHeaders.cookie)
        const accessToken = cookies["sb-access-token"]
        if (!accessToken) {
            throw new Error("Authentication required.")
        }
        const { user } = await supabaseClient.auth.api.getUser(accessToken)
        if (!user) {
            throw new Error("Invalid token.")
        }

        const documentId = documentName.split(".").pop()
        const { data: document, error } = await supabaseServerClient(
            accessToken
        )
            .from("documents")
            .select("user_id, share_settings(*)")
            .eq("id", documentId)
            .single()

        if (error) {
            console.log(error)
            throw new Error("Unauthorized.")
        }

        if (
            document.share_settings?.is_public ||
            document.share_settings?.users_can_read.includes(user.id)
        ) {
            connection.readOnly = true
        }

        return {
            user: {
                accessToken,
                ...user
            }
        }
    }
}