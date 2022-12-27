import Router from "next/router"
import {
    RiBold as BoldIcon,
    RiDoubleQuotesR as QuoteIcon,
    RiFileLine as PageIcon,
    RiFunctions as EquationIcon,
    RiH1 as Heading1Icon,
    RiH2 as Heading2Icon,
    RiH3 as Heading3Icon,
    RiImageLine as ImageIcon,
    RiItalic as ItalicIcon,
    RiListCheck2 as CheckListIcon,
    RiListOrdered as OrderedListIcon,
    RiListUnordered as UnorderedListIcon,
    RiSeparator as DividerIcon,
    RiStickyNote2Line as NoteIcon,
    RiStrikethrough as StrikethroughIcon,
    RiUnderline as UnderlineIcon
} from "react-icons/ri"
import store from "src/store"
import { supabaseClient } from "src/utils/supabase"
import tippy from "tippy.js"

import { ReactRenderer } from "@tiptap/react"
import { SuggestionOptions } from "@tiptap/suggestion"

import CommandsList from "./CommandsList"

const items = {
    Blocs: [
        {
            name: "Titre principal",
            description: "Un titre de grande taille",
            aliases: ["one", "heading", "h1", "#"],
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run()
            },
            icon: <Heading1Icon />
        },
        {
            name: "Titre secondaire",
            description: "Un titre de taille moyenne",
            aliases: ["two", "second", "heading", "h2", "##"],
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run()
            },
            icon: <Heading2Icon />
        },
        {
            name: "Sous-titre",
            description: "Un titre de petite taille",
            aliases: ["three", "third", "heading", "h3", "###", "subtitle"],
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 3 })
                    .run()
            },
            icon: <Heading3Icon />
        },
        {
            name: "Citation",
            description: "Une citation à mettre en valeur",
            aliases: ["quote", "quotation", "blockquote"],
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
            },
            icon: <QuoteIcon />
        },
        {
            name: "Séparateur",
            description: "Une ligne de séparation",
            aliases: ["divider", "separator", "hr", "horizontalline", "rule"],
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setHorizontalRule()
                    .run()
            },
            icon: <DividerIcon />
        },
        {
            name: "Note",
            description: "Une note importante",
            aliases: ["callout", "important", "warning", "block"],
            command: ({ editor, range }) => {
                // editor
                //     .chain()
                //     .focus()
                //     .deleteRange(range)
                //
                //     .run()
            },
            icon: <NoteIcon />
        },
        {
            name: "Liste à puces",
            description: "Une liste à puces",
            aliases: ["ul", "unordered"],
            command: ({ editor, range }) => {
                // editor
                //     .chain()
                //     .focus()
                //     .deleteRange(range)
                //
                //     .run()
            },
            icon: <UnorderedListIcon />
        },
        {
            name: "Liste numérotée",
            description: "Une liste numérotée",
            aliases: ["ol", "ordered"],
            command: ({ editor, range }) => {
                // editor
                //     .chain()
                //     .focus()
                //     .deleteRange(range)
                //
                //     .run()
            },
            icon: <OrderedListIcon />
        },
        {
            name: "Liste de tâches",
            description: "Une liste de cases à cocher",
            aliases: ["task", "checklist"],
            command: ({ editor, range }) => {
                // editor
                //     .chain()
                //     .focus()
                //     .deleteRange(range)
                //     .setHorizontalRule()
                //     .run()
            },
            icon: <CheckListIcon />
        },
        {
            name: "Image",
            description: "Une image",
            aliases: ["picture", "img"],
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .insertImagePlaceholder()
                    .run()
            },
            icon: <ImageIcon />
        },
        {
            name: "Équation",
            description: "Une équation LaTeX",
            aliases: ["equation", "tex", "math"],
            command: ({ editor, range }) => {
                // editor
                //     .chain()
                //     .focus()
                //     .deleteRange(range)
                //
                //     .run()
            },
            icon: <EquationIcon />
        },
        {
            name: "Page intégrée",
            description: "Une page intégrée dans cette page",
            aliases: ["subpage", "embeddedpage", "subdocument", "document"],
            command: async ({ editor, range }) => {
                const navigationStore = store.getState().navigation

                const { data, error } = await supabaseClient
                    .from("documents")
                    .insert({
                        parent: navigationStore.activeDocument
                    })
                    .select("id")

                if (error) {
                    console.error(error)
                    return alert("Impossible de créer la page intégrée")
                }

                const docId = data[0].id
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .insertSubdocument(docId)
                    .run()

                Router.push(`${Router.asPath.split(/\/[^/]*$/)[0]}/${docId}`)
            },
            icon: <PageIcon />
        }
    ],
    Format: [
        {
            name: "Gras",
            description: "Texte en gras",
            aliases: ["bold", "strong", "**"],
            command: async ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBold().run()
            },
            icon: <BoldIcon />
        },
        {
            name: "Italique",
            description: "Texte en italique",
            aliases: ["italic", "emphasized", "*"],
            command: async ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleItalic().run()
            },
            icon: <ItalicIcon />
        },
        {
            name: "Souligné",
            description: "Texte souligné",
            aliases: ["underline", "__"],
            command: async ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleUnderline()
                    .run()
            },
            icon: <UnderlineIcon />
        },
        {
            name: "Barré",
            description: "Texte barré",
            aliases: ["strikethrough", "~~", "--"],
            command: async ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleStrike().run()
            },
            icon: <StrikethroughIcon />
        }
    ]
}

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
        const filteredItems = filterItems(items, query)
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
