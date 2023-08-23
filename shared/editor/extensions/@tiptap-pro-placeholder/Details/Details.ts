import { Node } from "@tiptap/core"

/**
 * Placeholder to prevent the app from crashing. This is not the actual extension.
 * Actual extension is here : https://tiptap.dev/api/nodes/details
 **/

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        details: {
            /**
             * Set a details node
             */
            setDetails: () => ReturnType
            /**
             * Unset a details node
             */
            unsetDetails: () => ReturnType
        }
    }
}

export default Node.create({
    name: "details",

    content: "paragraph",

    group: "block",

    parseHTML() {
        return [
            {
                tag: "details"
            }
        ]
    },

    renderHTML() {
        return ["details"]
    },

    addCommands() {
        return {
            setDetails: () => (editor) => {
                return editor.commands.insertContent("")
            },
            unsetDetails: () => (editor) => {
                return editor.commands.insertContent("")
            }
        }
    }
})
