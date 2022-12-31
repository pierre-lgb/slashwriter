import { Extension } from "@tiptap/core"
import Suggestion from "@tiptap/suggestion"

import suggestionConfig from "./suggestion"

export default Extension.create({
    name: "SlashCommands",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({ editor, range, props }) => {
                    props.command({ editor, range })
                },
                ...suggestionConfig
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
