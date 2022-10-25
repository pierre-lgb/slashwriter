import * as cookie from "cookie"

import { Extension, onAuthenticatePayload } from "@hocuspocus/server"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"

import { supabaseServerClient } from "../utils"

export default class AuthenticationExtension implements Extension {
    async onAuthenticate({
        documentName,
        connection,
        requestHeaders
    }: onAuthenticatePayload) {
        const cookies = cookie.parse(requestHeaders.cookie || "")
        const accessToken = cookies["sb-access-token"]

        const { user } = await supabaseClient.auth.api.getUser(accessToken)

        const documentId = documentName.split(".").pop()
        const { data: document, error } = await supabaseServerClient(
            accessToken
        )
            .from("documents")
            .select("user_id, share_settings(*)")
            .eq("id", documentId)
            .single()

        if (error) {
            console.log(user)
            console.log("accessToken", accessToken)
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
            user: {
                accessToken: accessToken || "",
                ...user
            }
        }
    }
}
