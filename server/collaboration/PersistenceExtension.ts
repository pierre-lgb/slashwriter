import { Node } from "prosemirror-model"
import { yDocToProsemirrorJSON } from "y-prosemirror"
import * as Y from "yjs"

import { Extension, onLoadDocumentPayload, onStoreDocumentPayload } from "@hocuspocus/server"

import editorSchema from "../../shared/editor/schema"
import { supabaseClientWithAuth } from "../utils"

export default class PersistenceExtension implements Extension {
    async onLoadDocument({
        documentName,
        context,
        document: ydoc
    }: onLoadDocumentPayload) {
        const documentId = documentName.split(".").pop()
        const { user, session } = context
        console.log(
            `Loading document ${documentId} for user ${user.email} (${user.id})`
        )

        if (!ydoc.isEmpty("default")) {
            return
        }

        const { data: document, error } = await supabaseClientWithAuth(session)
            .from("documents")
            .select("state")
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
        context
    }: onStoreDocumentPayload) {
        const documentId = documentName.split(".").pop()
        const { user, permission, session } = context
        if (permission !== "edit") {
            return
        }

        console.log(
            `Persisting document ${documentId} for user ${user.email} (${user.id})`
        )

        const title = Node.fromJSON(
            editorSchema,
            yDocToProsemirrorJSON(ydoc, "title")
        ).textContent

        const docNode = Node.fromJSON(
            editorSchema,
            yDocToProsemirrorJSON(ydoc, "default")
        )

        const text_preview = docNode
            .textBetween(1, docNode.nodeSize - 3, " ")
            .slice(0, 100)

        console.log("TEXT_PREVIEW", text_preview)

        const state = Y.encodeStateAsUpdate(ydoc)

        const { error } = await supabaseClientWithAuth(session)
            .from("documents")
            .update({ title, state, text_preview })
            .eq("id", documentId)

        if (error) {
            console.error(error)
        }
    }
}
