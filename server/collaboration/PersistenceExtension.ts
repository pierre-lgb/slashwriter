import { Node } from "prosemirror-model"
import { yDocToProsemirrorJSON } from "y-prosemirror"
import * as Y from "yjs"

import { Extension, onLoadDocumentPayload, onStoreDocumentPayload } from "@hocuspocus/server"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"

import { editorSchema, supabaseServerClient } from "../utils"

export default class PersistenceExtension implements Extension {
    async onLoadDocument({
        documentName,
        context,
        document: ydoc
    }: onLoadDocumentPayload) {
        const documentId = documentName.split(".").pop()
        const { user } = context
        console.log(
            `Loading document ${documentId} for user ${user.email} (${user.id})`
        )

        if (!ydoc.isEmpty("default")) {
            return
        }

        const { data: document, error } = await supabaseServerClient(
            user.accessToken
        )
            .from("documents")
            .select("text, state")
            .eq("id", documentId)
            .single()

        if (error) {
            return console.error(error)
        }

        if (document.state) {
            const { state: stateHEX } = document
            const ydoc = new Y.Doc()

            const buffer = Buffer.from(stateHEX.substr(2), "hex")
            const uint8Array = new Uint8Array(
                Object.values(JSON.parse(buffer.toString()))
            )

            Y.applyUpdate(ydoc, uint8Array)
            return ydoc
        }

        return new Y.Doc()
    }

    async onStoreDocument({
        documentName,
        document: ydoc,
        context: { user }
    }: onStoreDocumentPayload) {
        const documentId = documentName.split(".").pop()
        console.log(
            `Persisting document ${documentId} for user ${user.email} (${user.id})`
        )

        const title = Node.fromJSON(
            editorSchema,
            yDocToProsemirrorJSON(ydoc, "title")
        ).textContent

        const state = Y.encodeStateAsUpdate(ydoc)

        const { data, error } = await supabaseClient
            .from("documents")
            .update({ title, state })
            .eq("id", documentId)

        if (error) {
            console.error(error)
        } else if (!data.length) {
            console.error("Couldn't update document", documentId)
        }
    }
}
