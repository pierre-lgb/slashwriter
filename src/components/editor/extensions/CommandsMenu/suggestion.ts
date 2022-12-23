import Router from "next/router"
import store from "src/store"
import { supabaseClient } from "src/utils/supabase"
import tippy from "tippy.js"

import { ReactRenderer } from "@tiptap/react"

import CommandsList from "./CommandsList"

const suggestionConfig = {
    items: ({ query }) => {
        return [
            {
                title: "Titre principal",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 1 })
                        .run()
                }
            },
            {
                title: "Titre secondaire",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 2 })
                        .run()
                }
            },
            {
                title: "Sous-titre",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 3 })
                        .run()
                }
            },
            {
                title: "Citation",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: "blockquote",
                            content: [
                                {
                                    type: "paragraph"
                                }
                            ]
                        })
                        .run()
                }
            },
            {
                title: "Séparateur",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setHorizontalRule()
                        .run()
                }
            },
            {
                title: "Gras",
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBold().run()
                }
            },
            {
                title: "Italique",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleItalic()
                        .run()
                }
            },
            {
                title: "Barré",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleStrike()
                        .run()
                }
            },
            {
                title: "Page intégrée",
                command: async ({ editor, range }) => {
                    const navigationStore = store.getState().navigation
                    console.log(navigationStore.activeDocument)
                    const { data, error } = await supabaseClient
                        .from("documents")
                        .insert({
                            parent: navigationStore.activeDocument
                        })
                        .select()

                    if (data) {
                        const docId = data[0].id
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .insertSubdocument(docId)
                            .run()

                        Router.push(
                            `${Router.asPath.split(/\/[^/]*$/)[0]}/${docId}`
                        )
                    } else {
                        console.error(error)
                        return alert("Impossible de créer un sous-document")
                    }
                }
            }
        ].filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
        )
    },

    render: () => {
        let component
        let popup

        return {
            onStart: (props) => {
                component = new ReactRenderer(CommandsList, {
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
                popup[0].destroy()
                component.destroy()
            }
        }
    }
}

export default suggestionConfig
