import { Node } from "prosemirror-model"
import { yDocToProsemirrorJSON } from "y-prosemirror"
import * as Y from "yjs"

import {
    Extension,
    onLoadDocumentPayload,
    onStoreDocumentPayload
} from "@hocuspocus/server"
import { getSchema, getTextSerializersFromSchema } from "@tiptap/core"
import Document from "@tiptap/extension-document"
import Heading from "@tiptap/extension-heading"
import Text from "@tiptap/extension-text"

import editorSchema from "../../shared/editor/schema"
import { getSupabaseClient } from "../utils"

export default class PersistenceExtension implements Extension {
    async onLoadDocument({
        documentName,
        context,
        document: ydoc
    }: onLoadDocumentPayload) {
        const documentId = documentName.split(".").pop()
        const { user, session } = context

        if (user) {
            console.log(
                `Loading document ${documentId} for user ${user.email} (${user.id}).`
            )
        } else {
            console.log(`Loading document ${documentId} from anonymous user.`)
        }

        if (!ydoc.isEmpty("default")) {
            return
        }

        const supabaseClient = session
            ? await getSupabaseClient({
                  access_token: session.access_token,
                  refresh_token: session.refresh_token
              })
            : await getSupabaseClient()

        if (!supabaseClient) {
            throw new Error("Invalid session.")
        }

        const { data: document, error } = await supabaseClient
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

        if (user) {
            console.log(
                `Persisting document ${documentId} for user ${user.email} (${user.id}).`
            )
        } else {
            console.log(`Persisting document ${documentId} for anonymous user.`)
        }

        const title = Node.fromJSON(
            getSchema([Document, Text, Heading]),
            yDocToProsemirrorJSON(ydoc, "title")
        ).textContent

        const docNode = Node.fromJSON(
            editorSchema,
            yDocToProsemirrorJSON(ydoc, "default")
        )

        const text_preview = docNode
            .textBetween(0, docNode.nodeSize - 2, " ")
            .slice(0, 100)

        const state = Y.encodeStateAsUpdate(ydoc)

        const supabaseClient = session
            ? await getSupabaseClient({
                  access_token: session.access_token,
                  refresh_token: session.refresh_token
              })
            : await getSupabaseClient()

        if (!supabaseClient) {
            throw new Error("Invalid session.")
        }

        const { data, error } = await supabaseClient
            .from("documents")
            .update({ title, state, text_preview })
            .eq("id", documentId)
        // Uncomment to log state hex string when persisting document
        //     .select("state")
        //     .single()
        // console.log(data?.state)

        if (error) {
            console.error(error)
        }
    }
}
