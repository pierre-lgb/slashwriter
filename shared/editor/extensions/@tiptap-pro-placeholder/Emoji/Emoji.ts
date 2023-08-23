import { Node } from "@tiptap/core"

/**
 * Placeholder to prevent the app from crashing. This is not the actual extension.
 * Actual extension is here : https://tiptap.dev/api/nodes/emoji
 **/

export default Node.create({
    name: "emoji",

    inline: true,

    group: "inline",

    parseHTML() {
        return [
            {
                tag: `span[data-type="${this.name}"]`
            }
        ]
    },

    renderHTML() {
        return ["span"]
    }
})
