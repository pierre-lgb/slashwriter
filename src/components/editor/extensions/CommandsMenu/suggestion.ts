import Router from 'next/router'
import store from 'src/store'
import { supabaseClient } from 'src/utils/supabase'
import tippy from 'tippy.js'

import { ReactRenderer } from '@tiptap/react'

import CommandsList from './CommandsList'

const suggestionConfig = {
    items: ({ query }) => {
        return [
            {
                title: "H1",
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
                title: "H2",
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
                title: "H3",
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
                title: "Blockquote",
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
                title: "Divider",
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
                title: "Bold",
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBold().run()
                }
            },
            {
                title: "Italic",
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
                title: "Strike",
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
                title: "Highlight",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleHighlight()
                        .run()
                }
            },
            {
                title: "Subdocument",
                command: async ({ editor, range }) => {
                    const navigationStore = store.getState().navigation
                    const { data, error } = await supabaseClient
                        .from("documents")
                        .insert({
                            folder: navigationStore.currentFolder.id,
                            parent: navigationStore.currentDocument.id
                        })

                    if (data) {
                        editor
                            .chain()
                            .focus()
                            .deleteRange(range)
                            .insertSubdocument(data[0].id)
                            .run()

                        Router.push(`/doc/${data[0].id}`)
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
                    theme: "light-border",
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
