import { Extension } from "@tiptap/core"
import Suggestion from "@tiptap/suggestion"

const defaultSuggestionConfig = {
    char: "/",
    command: ({ editor, range, props }) => {
        props.command({ editor, range })
    }
}

export default Extension.create({
    name: "SlashCommands",

    addOptions() {
        return {
            suggestion: {}
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...defaultSuggestionConfig,
                ...this.options.suggestion
            })
        ]
    }
})
