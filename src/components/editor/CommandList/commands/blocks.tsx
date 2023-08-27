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

const blocks = [
    {
        name: "Big Heading",
        description: "A big section heading",
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
        name: "Medium Heading",
        description: "A medium section heading",
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
        name: "Small Heading",
        description: "A small section heading",
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
        name: "Quote",
        description: "A quote to emphasize",
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
        name: "Separator",
        description: "A line to separate section",
        aliases: ["divider", "separator", "hr", "horizontalline", "rule"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
        },
        icon: <DividerIcon />
    },
    {
        name: "Callout with Icon",
        description: "A callout block with an icon",
        aliases: ["callout", "important", "warning", "block", "note", "icon"],
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
        name: "Callout",
        description: "A simple callout block",
        aliases: ["callout", "important", "warning", "block", "note"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCallout().run()
        },
        icon: <CalloutIcon />
    },
    {
        name: "Unordered List",
        description: "An unordered list of items",
        aliases: ["ul", "unordered", "list"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
        icon: <UnorderedListIcon />
    },
    {
        name: "Ordered List",
        description: "An ordered list of items",
        aliases: ["ol", "ordered", "list"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
        icon: <OrderedListIcon />
    },
    {
        name: "Task List",
        description: "A list of tasks to do",
        aliases: ["task", "checklist"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run()
        },
        icon: <CheckListIcon />
    },
    {
        name: "Image",
        description: "A simple image",
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
        name: "Code Block",
        description: "A code block with syntax highlighting",
        aliases: ["pre", "codeblock", "snippet"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
        },
        icon: <CodeBlockIcon />
    },

    {
        name: "Inline Equation",
        description: "An inline LaTeX equation",
        aliases: ["equation", "tex", "math", "katex", "latex", "inline"],
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
        name: "Block Equation",
        description: "A block LaTeX equation",
        aliases: ["equation", "tex", "math", "katex", "latex", "block"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setEquationBlock().run()
        },
        icon: <EquationIcon />
    },
    {
        name: "Collapsible",
        description: "A collapsible block",
        aliases: ["details", "toggle", "collapse", "collapsible"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setDetails().run()
        },
        icon: <DetailsIcon />
    },
    {
        name: "Table",
        description: "A simple table",
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
        description: "An embedded subdocument",
        aliases: ["subpage", "embeddedpage", "subdocument", "document", "page"],
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
