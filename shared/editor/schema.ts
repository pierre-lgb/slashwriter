import { getSchema } from "@tiptap/core"
import Blockquote from "@tiptap/extension-blockquote"
import Bold from "@tiptap/extension-bold"
import BulletList from "@tiptap/extension-bullet-list"
import Code from "@tiptap/extension-code"
import Document from "@tiptap/extension-document"
import HardBreak from "@tiptap/extension-hard-break"
import Heading from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import Italic from "@tiptap/extension-italic"
import Link from "@tiptap/extension-link"
import ListItem from "@tiptap/extension-list-item"
import OrderedList from "@tiptap/extension-ordered-list"
import Paragraph from "@tiptap/extension-paragraph"
import Strike from "@tiptap/extension-strike"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Text from "@tiptap/extension-text"
import Underline from "@tiptap/extension-underline"
import Youtube from "@tiptap/extension-youtube"

import Details from "./extensions/@tiptap-pro/Details"
import Emoji from "./extensions/@tiptap-pro/Emoji"
import Callout from "./extensions/Callout"
import CodeBlock from "./extensions/CodeBlock"
import Equation from "./extensions/Equation"
import EquationBlock from "./extensions/EquationBlock"
import HorizontalRule from "./extensions/HorizontalRule"
import Image from "./extensions/Image"
import ImagePlaceholder from "./extensions/Image/ImagePlaceholder"
import Subdocument from "./extensions/Subdocument"
import Table from "./extensions/Table"
import TableCell from "./extensions/TableCell"
import TableHeader from "./extensions/TableHeader"
import TableRow from "./extensions/TableRow"
import TaskItem from "./extensions/TaskItem"
import TaskList from "./extensions/TaskList"

export default getSchema([
    // Nodes
    Document,
    Text,
    Paragraph,
    Blockquote,
    Heading.configure({
        levels: [1, 2, 3]
    }),
    BulletList,
    OrderedList,
    ListItem,
    TaskList,
    TaskItem,
    Image,
    ImagePlaceholder,
    HorizontalRule,
    Subdocument,
    Details,
    Youtube,
    Callout,
    CodeBlock,
    TableCell,
    TableHeader,
    TableRow,
    Table,
    Emoji,
    Equation,
    EquationBlock,
    HardBreak,

    // Format
    Bold,
    Italic,
    Strike,
    Underline,
    Highlight,
    Link,
    Code,
    Subscript,
    Superscript
])
