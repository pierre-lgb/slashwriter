"use client"

import {
    KeyboardEvent,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState
} from "react"
import Details from "shared/editor/extensions/@tiptap-pro/Details"
import Emoji from "shared/editor/extensions/@tiptap-pro/Emoji"
import Callout from "shared/editor/extensions/Callout"
import CodeBlock from "shared/editor/extensions/CodeBlock"
import Collaboration from "shared/editor/extensions/Collaboration"
import CollaborationCursor from "shared/editor/extensions/CollaborationCursor"
import DragAndDrop from "shared/editor/extensions/DragAndDrop"
import Equation from "shared/editor/extensions/Equation"
import EquationBlock from "shared/editor/extensions/EquationBlock"
import HorizontalRule from "shared/editor/extensions/HorizontalRule"
import Image from "shared/editor/extensions/Image"
import ImagePlaceholder from "shared/editor/extensions/Image/ImagePlaceholder"
import Shortcuts from "shared/editor/extensions/Shortcuts"
import SlashCommands from "shared/editor/extensions/SlashCommands"
import Subdocument from "shared/editor/extensions/Subdocument"
import Table from "shared/editor/extensions/Table"
import TableCell from "shared/editor/extensions/TableCell"
import TableHeader from "shared/editor/extensions/TableHeader"
import TableRow from "shared/editor/extensions/TableRow"
import TaskItem from "shared/editor/extensions/TaskItem"
import TaskList from "shared/editor/extensions/TaskList"
import TrailingNode from "shared/editor/extensions/TrailingNode"
import * as documentsApi from "src/api/documents"
import emojis from "src/assets/emojis"
import { useAppDispatch } from "src/store"
import { IndexeddbPersistence } from "y-indexeddb"
import * as Y from "yjs"

import { HocuspocusProvider } from "@hocuspocus/provider"
import Blockquote from "@tiptap/extension-blockquote"
import Bold from "@tiptap/extension-bold"
import BulletList from "@tiptap/extension-bullet-list"
import Code from "@tiptap/extension-code"
import Document from "@tiptap/extension-document"
import Dropcursor from "@tiptap/extension-dropcursor"
import Focus from "@tiptap/extension-focus"
import HardBreak from "@tiptap/extension-hard-break"
import Heading from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import Italic from "@tiptap/extension-italic"
import Link from "@tiptap/extension-link"
import ListItem from "@tiptap/extension-list-item"
import OrderedList from "@tiptap/extension-ordered-list"
import Paragraph from "@tiptap/extension-paragraph"
import Placeholder from "@tiptap/extension-placeholder"
import Strike from "@tiptap/extension-strike"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Text from "@tiptap/extension-text"
import Underline from "@tiptap/extension-underline"
import Youtube from "@tiptap/extension-youtube"
import { EditorContent, useEditor } from "@tiptap/react"

import { useSupabase } from "../supabase/SupabaseProvider"
import Flex from "../ui/Flex"
import Loader from "../ui/Loader"
import BlockMenu from "./BlockMenu"
import BubbleMenu from "./BubbleMenu"
import CalloutEmojiMenu from "./CalloutEmojiMenu"
import slashCommandsSuggestionConfig from "./CommandList/suggestion"
import emojiSuggestionConfig from "./EmojiList/suggestion"
import EquationBlockComponent from "./EquationBlockComponent"
import EquationComponent from "./EquationComponent"
import ImageComponent from "./ImageComponent"
import ImagePlaceholderComponent from "./ImagePlaceholderComponent"
import styles from "./SlashwriterEditor.module.scss"
import SubdocumentComponent from "./SubdocumentComponent"

function getRandomName() {
    const NAMES = ["Anonymous", "Toad", "Yoshi", "Luma", "Boo"]
    return NAMES[Math.round(Math.random() * (NAMES.length - 1))]
}

function getRandomColor() {
    const COLORS = ["#ffb020", "#3366ff", "#474d66"]
    return COLORS[Math.round(Math.random() * (COLORS.length - 1))]
}

export default function SlashwriterEditor(props: {
    documentId: string
    user: { email?: string }
    token: string
    editable?: boolean
}) {
    const { documentId, user, token = "anonymous", editable = true } = props

    const { supabaseClient } = useSupabase()

    const dispatch = useAppDispatch()

    const ydoc = useMemo(() => new Y.Doc(), [documentId]) // eslint-disable-line react-hooks/exhaustive-deps

    const [isLocalSynced, setLocalSynced] = useState(false)
    const [isRemoteSynced, setRemoteSynced] = useState(false)

    const localProvider = useMemo(() => {
        const provider = new IndexeddbPersistence(
            `document.${documentId}`,
            ydoc
        )

        provider.on("synced", () => {
            // Only set local storage to "synced" if it's loaded a non-empty doc
            setLocalSynced(!!ydoc.get("default")._start)
        })

        return provider
    }, [documentId, ydoc])

    const remoteProvider = useMemo(() => {
        const provider = new HocuspocusProvider({
            name: `document.${documentId}`,
            url: process.env.NEXT_PUBLIC_COLLABORATION_URL || "",
            document: ydoc,
            // We start the connection inside useLayoutEffect()
            // to prevent orphan connection with React StrictMode
            connect: false,
            token,
            onStatus({ status }) {
                // setStatus(status)
            }
        })

        provider.on("synced", () => {
            setRemoteSynced(true)
        })

        return provider
    }, [documentId, ydoc])

    useLayoutEffect(() => {
        remoteProvider.connect()

        return () => {
            setRemoteSynced(false)
            setLocalSynced(false)
            remoteProvider.destroy()
            localProvider.destroy()
        }
    }, [remoteProvider, localProvider])

    function handleTitleEditorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (!titleEditor || !contentEditor) return
        const selection = titleEditor.state.selection
        if (event.shiftKey) {
            return
        }

        if (event.key === "Enter" || event.key === "ArrowDown") {
            contentEditor.commands.focus("start")
        }

        if (event.key === "ArrowRight") {
            if (selection?.$head.nodeAfter === null) {
                contentEditor.commands.focus("start")
            }
        }
    }

    const userCursor = useMemo(() => {
        return {
            name: user?.email || getRandomName(),
            color: getRandomColor()
        }
    }, [user])

    const titleEditor = useEditor(
        {
            extensions: [
                Document.extend({
                    content: "heading"
                }),
                Text,
                Heading.configure({
                    levels: [1]
                }),
                Placeholder.configure({
                    placeholder: "Enter a title"
                }),
                Collaboration.configure({
                    document: remoteProvider.document,
                    field: "title"
                }),
                CollaborationCursor.configure({
                    provider: remoteProvider,
                    user: userCursor
                })
            ],

            editable
        },
        [documentId, editable, remoteProvider]
    )

    const contentEditor = useEditor(
        {
            extensions: [
                // Nodes
                Document,
                Text,
                Paragraph,
                Blockquote.extend({
                    addInputRules: () => []
                }),
                Heading.configure({
                    levels: [1, 2, 3]
                }),
                BulletList,
                OrderedList,
                ListItem,
                TaskList,
                TaskItem,
                Image.configure({
                    Component: ImageComponent
                }),
                ImagePlaceholder.configure({
                    Component: ImagePlaceholderComponent
                }),
                HorizontalRule,
                Subdocument.configure({
                    Component: SubdocumentComponent,
                    onDeleteSubdocument: (id) => {
                        console.log("Delete subdocument", id)
                        supabaseClient
                            .from("documents")
                            .update({
                                deleted: true
                            })
                            .match({ id })
                    }
                }),
                Details,
                Youtube,
                Callout,
                CodeBlock,
                TableCell,
                TableHeader,
                TableRow,
                Table,
                Emoji.configure({
                    suggestion: emojiSuggestionConfig,
                    emojis: emojis["en"]
                }),
                Equation.configure({
                    Component: EquationComponent
                }),
                EquationBlock.configure({
                    Component: EquationBlockComponent
                }),

                // Format
                Bold,
                Italic,
                Strike,
                Underline,
                Highlight,
                Link,
                Code,
                Subscript,
                Superscript,

                // Extensions
                TrailingNode,
                DragAndDrop,
                HardBreak,
                Shortcuts,
                Focus,
                Dropcursor.configure({
                    width: 3,
                    color: "#BFE5F4",
                    class: "drop-cursor"
                }),
                SlashCommands.configure({
                    suggestion: slashCommandsSuggestionConfig
                }),
                Placeholder.configure({
                    placeholder: "Write something here..."
                }),
                Collaboration.configure({
                    document: remoteProvider.document,
                    field: "default"
                }),
                CollaborationCursor.configure({
                    provider: remoteProvider,
                    user: userCursor
                })
            ],
            editable
        },
        [documentId, editable, remoteProvider]
    )

    const isSynced = isLocalSynced || isRemoteSynced

    useEffect(() => {
        if (isSynced) {
            titleEditor?.commands.focus()
        }
    }, [isSynced])

    return isSynced ? (
        <div className={styles.editorContainer}>
            {isSynced && (
                <>
                    <EditorContent
                        className={styles.titleEditor}
                        editor={titleEditor}
                        onKeyDown={handleTitleEditorKeyDown}
                        spellCheck="false"
                    />

                    <EditorContent
                        className={styles.contentEditor}
                        editor={contentEditor}
                        spellCheck="false"
                    />
                    {contentEditor && contentEditor.isEditable && (
                        <>
                            <BubbleMenu editor={contentEditor} />
                            <BlockMenu editor={contentEditor} />
                            <CalloutEmojiMenu editor={contentEditor} />
                        </>
                    )}
                </>
            )}
        </div>
    ) : (
        <Flex align="center" justify="center" style={{ height: "100%" }}>
            <Loader size="large" />
        </Flex>
    )
}
