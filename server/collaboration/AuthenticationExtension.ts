import * as cookie from "cookie"

import { Extension, onAuthenticatePayload } from "@hocuspocus/server"

import { parseSupabaseCookie, supabaseClient, supabaseClientWithAuth } from "../utils"

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
        const { error: canReadError } = await supabaseClient.rpc(
            "canreaddocument",
            {
                user_id: user?.id || null,
                document_id: documentId
            }
        )

        if (canReadError) {
            console.error(canReadError)
            throw new Error("Not allowed.")
        }

        const { error: canEditError } = await supabaseClient.rpc(
            "caneditdocument",
            {
                user_id: user?.id || null,
                document_id: documentId
            }
        )

        if (!!canEditError) {
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
