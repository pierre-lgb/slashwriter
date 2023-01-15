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
        const { data: permission, error } = await supabaseClient
            .rpc("get_user_permission_for_document", {
                document_id: documentId,
                user_id: user?.id || null,
                document: null
            })
            .single()

        if (!["read", "edit"].includes(permission)) {
            console.error(error)
            throw new Error("Not allowed.")
        }

        if (permission !== "edit") {
            connection.readOnly = true
        }

        return {
            session,
            permission: permission === "edit" ? "edit" : "read",
            user: {
                ...user
            }
        }
    }
}
