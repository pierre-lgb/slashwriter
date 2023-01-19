import Router from "next/router"
import {
    RiCodeBoxLine as CodeBlockIcon,
    RiDoubleQuotesR as QuoteIcon,
    RiFileLine as DocumentIcon,
    RiFunctions as EquationIcon,
    RiH1 as Heading1Icon,
    RiH2 as Heading2Icon,
    RiH3 as Heading3Icon,
    RiImageLine as ImageIcon,
    RiListCheck2 as CheckListIcon,
    RiListOrdered as OrderedListIcon,
    RiListUnordered as UnorderedListIcon,
    RiNotificationBadgeLine as CalloutWithIconIcon,
    RiPlayList2Line as DetailsIcon,
    RiSeparator as DividerIcon,
    RiStickyNote2Line as CalloutIcon,
    RiTable2 as TableIcon
} from "react-icons/ri"
import { TbMath as EquationInlineIcon } from "react-icons/tb"
import store from "src/store"
import { supabaseClient } from "src/utils/supabase"

const blocks = [
    {
        name: "Titre principal",
        description: "Un titre de grande taille",
        aliases: ["one", "heading", "h1", "#", "titre1"],
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
        aliases: ["two", "second", "heading", "h2", "##", "titre2"],
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
        aliases: [
            "three",
            "third",
            "heading",
            "h3",
            "###",
            "subtitle",
            "titre",
            "soustitre",
            "titre3"
        ],
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
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
        icon: <DividerIcon />
    },
    {
        name: "Cadre avec icône",
        description: "Un texte et une icône encadrés",
        aliases: ["callout", "important", "warning", "block", "note"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleCallout({
                    emoji: "💡"
                })
                .run()
        },
        icon: <CalloutWithIconIcon />
    },
    {
        name: "Cadre",
        description: "Un texte encadré",
        aliases: ["callout", "important", "warning", "block", "note"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCallout().run()
        },
        icon: <CalloutIcon />
    },

    {
        name: "Liste à puces",
        description: "Une liste à puces",
        aliases: ["ul", "unordered"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
        icon: <UnorderedListIcon />
    },
    {
        name: "Liste numérotée",
        description: "Une liste numérotée",
        aliases: ["ol", "ordered"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
        icon: <OrderedListIcon />
    },
    {
        name: "Liste de tâches",
        description: "Une liste de cases à cocher",
        aliases: ["task", "checklist"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run()
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
        name: "Bloc de code",
        description: "Un extrait de code",
        aliases: ["pre", "codeblock", "snippet"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
        icon: <CodeBlockIcon />
    },

    {
        name: "Équation en ligne",
        description: "Une équation LaTeX en ligne",
        aliases: ["equation", "tex", "math", "katex", "latex"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setEquation()
                .setNodeSelection(range.from)
                .run()
        },
        icon: <EquationInlineIcon />
    },
    {
        name: "Équation en bloc",
        description: "Une équation LaTeX en bloc",
        aliases: ["equation", "tex", "math", "katex", "latex", "block"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setEquationBlock().run()
        },
        icon: <EquationIcon />
    },
    {
        name: "Dépliant",
        description: "Un menu dépliant",
        aliases: ["details", "toggle", "collapse", "collapsible"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setDetails().run()
        },
        icon: <DetailsIcon />
    },
    {
        name: "Tableau",
        description: "Un tableau",
        aliases: [
            "table",
            "cells",
            "columns",
            "colonnes",
            "cellules",
            "donnees",
            "données"
        ],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertTable({ rows: 2, cols: 2 })
                .run()
        },
        icon: <TableIcon />
    },
    {
        name: "Document",
        description: "Un document intégré",
        aliases: ["subpage", "embededpage", "subdocument", "document", "page"],
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertSubdocument("create_new")
                .run()
        },
        icon: <DocumentIcon />
    }
]

export default blocks
