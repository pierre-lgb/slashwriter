import { Extension, onAuthenticatePayload } from "@hocuspocus/server"
import { User } from "@supabase/supabase-js"

import { getSupabaseClient } from "../utils"

export default class AuthenticationExtension implements Extension {
    async onAuthenticate({
        documentName,
        connection,
        token
    }: onAuthenticatePayload) {
        const documentId = documentName.split(".").pop()

        let user: User | null = null
        const supabaseClient =
            token === "anonymous"
                ? await getSupabaseClient()
                : await getSupabaseClient(JSON.parse(token))

        if (!supabaseClient) {
            throw new Error("Invalid token.")
        }

        const {
            data: { session }
        } = await supabaseClient.auth.getSession()

        user = session?.user || null

        const { data: permission, error } = await supabaseClient
            .rpc("get_user_permission_for_document", {
                document_id: documentId,
                user_id: user?.id || null,
                document: null
            })
            .single()
        console.log("Permission :", permission)

        if (!["read", "edit"].includes(permission as string)) {
            console.error(error)
            throw new Error("Not allowed.")
        }

        if (permission !== "edit") {
            connection.readOnly = true
        }

        return {
            permission: permission === "edit" ? "edit" : "read",
            session,
            user
        }
    }
}
