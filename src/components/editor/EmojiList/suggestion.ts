import tippy from "tippy.js"

import { ReactRenderer } from "@tiptap/react"
import { SuggestionOptions } from "@tiptap/suggestion"

import EmojiList from "./EmojiList"

const suggestionConfig: Partial<SuggestionOptions> = {
    items: ({ editor, query }) => {
        const { emojis } = editor.storage.emoji

        // Transform the object structure in an array one
        const emojisArray = Object.entries(emojis).reduce(
            (acc: any[], [category, emojis]: [string, any[]]) => {
                acc.push(
                    ...emojis.map((emoji) => ({
                        ...emoji,
                        category
                    }))
                )

                return acc
            },
            []
        )

        query = query.toLowerCase()

        return emojisArray
            .filter(
                (emoji) =>
                    emoji.shortcode.startsWith(query) ||
                    emoji.tags.some((tag: string) => tag.startsWith(query))
            )
            .slice(0, 24)
    },

    allowSpaces: false,

    render() {
        let component
        let popup

        return {
            onStart(props) {
                component = new ReactRenderer(EmojiList, {
                    editor: props.editor,
                    props
                })

                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                    appendTo: document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    theme: "light-border no-padding",
                    animation: "shift-away",
                    trigger: "manual",
                    placement: "bottom-start",
                    arrow: false
                })
            },

            onUpdate(props) {
                component.updateProps(props)

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect
                })
            },

            onKeyDown(props) {
                if (props.event.key === "Escape") {
                    popup[0].hide()
                    component.destroy()

                    return true
                }

                return component.ref?.onKeyDown(props)
            },

            onExit() {
                popup[0].destroy()
                component.destroy()
            }
        }
    }
}

export default suggestionConfig
