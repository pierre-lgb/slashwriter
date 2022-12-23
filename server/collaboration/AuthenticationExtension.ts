import * as cookie from "cookie"

import { Extension, onAuthenticatePayload } from "@hocuspocus/server"

import { parseSupabaseCookie, supabaseClientWithAuth } from "../utils"

export default class AuthenticationExtension implements Extension {
    async onAuthenticate({
        documentName,
        connection,
        requestHeaders
    }: onAuthenticatePayload) {
        const cookies = cookie.parse(requestHeaders.cookie || "")
        const session = parseSupabaseCookie(cookies["supabase-auth-token"])
        const user = session?.user

        const documentId = documentName.split(".").pop()
        const { data: document, error } = await supabaseClientWithAuth(session)
            .from("documents")
            .select("user_id, share_settings(*)")
            .eq("id", documentId)
            .single()

        if (error) {
            console.log("session", session)
            console.log(error)
            throw new Error("An error occured.")
        }

        if (
            !(document.user_id === user?.id) &&
            !(
                document.share_settings?.anyone_can_edit ||
                document.share_settings?.users_can_edit?.includes(user?.id)
            ) &&
            (document.share_settings?.anyone_can_read ||
                document.share_settings?.users_can_read?.includes(user?.id))
        ) {
            connection.readOnly = true
        }

        return {
            session,
            user: {
                ...user
            }
        }
    }
}
