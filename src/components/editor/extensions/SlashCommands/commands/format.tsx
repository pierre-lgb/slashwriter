import { MdOutlineFontDownload as HighlightIcon } from "react-icons/md"
import {
    RiBold as BoldIcon,
    RiCodeSLine as CodeIcon,
    RiItalic as ItalicIcon,
    RiStrikethrough as StrikethroughIcon,
    RiSubscript as SubscriptIcon,
    RiSuperscript as SuperscriptIcon,
    RiUnderline as UnderlineIcon
} from "react-icons/ri"

const format = [
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
            editor.chain().focus().deleteRange(range).toggleUnderline().run()
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
    },
    {
        name: "Code",
        description: "Code en ligne",
        aliases: ["`"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCode().run()
        },
        icon: <CodeIcon />
    },
    {
        name: "Surligné",
        description: "Texte surligné",
        aliases: ["==", "highlight"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleHighlight().run()
        },
        icon: <HighlightIcon />
    },
    {
        name: "Indice",
        description: "Texte en indice",
        aliases: ["_", "subscript"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleSubscript().run()
        },
        icon: <SubscriptIcon />
    },
    {
        name: "Exposant",
        description: "Texte en exposant",
        aliases: ["^", "superscript"],
        command: async ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleSuperscript().run()
        },
        icon: <SuperscriptIcon />
    }
]

export default format
