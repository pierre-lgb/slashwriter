import { Extension } from "@tiptap/core"
import Suggestion from "@tiptap/suggestion"

export const CommandsMenu = Extension.create({
    name: "commandsMenu",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({ editor, range, props }) => {
                    props.command({ editor, range })
                }
            }
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion
            })
        ]
    }
})
