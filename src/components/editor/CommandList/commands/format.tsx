import {
    RiBold as BoldIcon,
    RiCodeSLine as CodeIcon,
    RiItalic as ItalicIcon,
    RiMarkPenLine as HighlightIcon,
    RiStrikethrough as StrikethroughIcon,
    RiSubscript as SubscriptIcon,
    RiSuperscript as SuperscriptIcon,
    RiUnderline as UnderlineIcon
} from "react-icons/ri"

const format = [
    {
        name: "Bold",
        description: "Bold text",
        aliases: ["bold", "strong", "**"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBold().run()
        },
        icon: <BoldIcon />
    },
    {
        name: "Italic",
        description: "Italic text",
        aliases: ["italic", "emphasized", "*"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleItalic().run()
        },
        icon: <ItalicIcon />
    },
    {
        name: "Underline",
        description: "Underlined text",
        aliases: ["underline", "__"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleUnderline().run()
        },
        icon: <UnderlineIcon />
    },
    {
        name: "Strikethrough",
        description: "Strikethrough text",
        aliases: ["strikethrough", "~~", "--"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleStrike().run()
        },
        icon: <StrikethroughIcon />
    },
    {
        name: "Code",
        description: "Inline code",
        aliases: ["`", "inline"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCode().run()
        },
        icon: <CodeIcon />
    },
    {
        name: "Highlight",
        description: "Highlighted text",
        aliases: ["==", "highlight"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleHighlight().run()
        },
        icon: <HighlightIcon />
    },
    {
        name: "Subscript",
        description: "Subscript text",
        aliases: ["_", "subscript", "indice"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleSubscript().run()
        },
        icon: <SubscriptIcon />
    },
    {
        name: "Superscript",
        description: "Superscript text",
        aliases: ["^", "superscript", "exposant"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleSuperscript().run()
        },
        icon: <SuperscriptIcon />
    }
]

export default format
