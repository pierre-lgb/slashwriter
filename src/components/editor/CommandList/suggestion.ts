import tippy from "tippy.js"

import { findParentNode } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import { SuggestionOptions } from "@tiptap/suggestion"

import CommandList from "./CommandList"
import commands from "./commands"

function filterItems(items, query) {
    const filteredItems = {}
    for (const category in items) {
        filteredItems[category] = items[category].filter((item) => {
            // Check if the item's name or any of its aliases start with the query
            return (
                item.name.toLowerCase().startsWith(query.toLowerCase()) ||
                item.aliases.some((alias) =>
                    alias.toLowerCase().startsWith(query.toLowerCase())
                )
            )
        })
    }
    return filteredItems
}

const suggestionConfig: Partial<SuggestionOptions> = {
    items: ({ query }) => {
        const filteredItems = filterItems(commands, query)
        const filteredItemsArray = Object.entries(filteredItems).reduce(
            (acc, curr: [string, any[]]) => {
                const [category, content] = curr
                content.forEach((item) => {
                    acc.push({
                        ...item,
                        category,
                        index: acc.length
                    })
                })

                return acc
            },
            []
        )

        return filteredItemsArray
    },

    allow({ editor, state, range }) {
        const isInsideTable = !!findParentNode(
            (node) => node.type.name === "table"
        )(editor.state.selection)

        if (isInsideTable) {
            return false
        }

        return true
    },

    render: () => {
        let component
        let popup

        return {
            onStart: (props) => {
                component = new ReactRenderer(CommandList, {
                    props,
                    editor: props.editor
                })

                if (!props.clientRect) {
                    return
                }

                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
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

            onUpdate: (props) => {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect
                })
            },

            onKeyDown: (props) => {
                if (props.event.key === "Escape") {
                    popup[0].hide()

                    return true
                }

                return component.ref?.onKeyDown(props)
            },

            onExit: () => {
                if (!popup[0].state.isDestroyed) {
                    popup[0].destroy()
                }
                if (component.ref !== null) {
                    component.destroy()
                }
            }
        }
    }
}

export default suggestionConfig
