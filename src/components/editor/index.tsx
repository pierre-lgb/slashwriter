import { KeyboardEvent, useEffect, useLayoutEffect, useMemo, useState } from "react"
import styled from "styled-components"
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
import { Editor, EditorContent } from "@tiptap/react"

import BlockMenu from "./components/BlockMenu"
import BubbleMenu from "./components/BubbleMenu"
import CalloutEmojiMenu from "./components/CalloutEmojiMenu"
import Details from "./extensions/@tiptap-pro/Details"
import Emoji from "./extensions/@tiptap-pro/Emoji"
import Callout from "./extensions/Callout"
import CodeBlock from "./extensions/CodeBlock"
import Collaboration from "./extensions/Collaboration"
import CollaborationCursor from "./extensions/CollaborationCursor"
import DragAndDrop from "./extensions/DragAndDrop"
import HorizontalRule from "./extensions/HorizontalRule"
import Image from "./extensions/Image"
import Shortcuts from "./extensions/Shortcuts"
import SlashCommands from "./extensions/SlashCommands"
import Subdocument from "./extensions/Subdocument"
import Table from "./extensions/Table"
import TableCell from "./extensions/TableCell"
import TableHeader from "./extensions/TableHeader"
import TableRow from "./extensions/TableRow"
import TaskItem from "./extensions/TaskItem"
import TaskList from "./extensions/TaskList"
import TrailingNode from "./extensions/TrailingNode"

function getRandomColor() {
    const COLORS = ["#ffb020", "#3366ff", "#474d66"]
    return COLORS[Math.round(Math.random() * (COLORS.length - 1))]
}

function useForceUpdate() {
    const [, setValue] = useState(0)

    return () => setValue((value) => value + 1)
}

export default function SlashwriterEditor(props: {
    documentId: string
    user: { email: string }
    editable?: boolean
}) {
    const { documentId, user, editable = true } = props
    const [contentEditor, setContentEditor] = useState<Editor | null>(null)
    const [titleEditor, setTitleEditor] = useState<Editor | null>(null)
    const ydoc = useMemo(() => new Y.Doc(), [documentId]) // eslint-disable-line react-hooks/exhaustive-deps
    const [, setStatus] = useState("connecting")

    const forceUpdate = useForceUpdate()

    const websocketProvider = useMemo(() => {
        return new HocuspocusProvider({
            name: `document.${documentId}`,
            url: process.env.NEXT_PUBLIC_COLLABORATION_URL,
            document: ydoc,
            // We start the connection inside useLayoutEffect()
            // so that a single connection is started (not two)
            connect: false,
            // The token is retrieved from the cookies server-side,
            // we only set a value for `token` here so that the
            // onAuthenticate hook does not log a warning message.
            token: "token",
            onStatus({ status }) {
                setStatus(status)
            }
        })
    }, [documentId, ydoc])

    const localProvider = useMemo(
        () => new IndexeddbPersistence(`document.${documentId}`, ydoc),
        [documentId, ydoc]
    )

    function getCollaborationExtensions(yDocField: string) {
        return [
            Collaboration.configure({
                document: websocketProvider.document,
                field: yDocField || "default"
            }),
            CollaborationCursor.configure({
                provider: websocketProvider,
                user: {
                    name: user.email,
                    color: getRandomColor()
                }
            })
        ]
    }

    function handleTitleEditorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
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

    useLayoutEffect(() => {
        websocketProvider.connect()

        return () => {
            websocketProvider.destroy()
            localProvider.destroy()
        }
    }, [websocketProvider, localProvider])

    useEffect(() => {
        const titleEditor = new Editor({
            extensions: [
                Document.extend({
                    content: "heading"
                }),
                Text,
                Heading.configure({
                    levels: [1]
                }),
                Placeholder.configure({
                    placeholder: "Entrez un titre"
                }),
                ...getCollaborationExtensions("title")
            ],
            autofocus: "start",
            onCreate({ editor }) {
                // Autofocus
                editor.commands.focus()
            },
            editable
        })

        const contentEditor = new Editor({
            extensions: [
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
                SlashCommands,
                Placeholder.configure({
                    placeholder: "Commencez à écrire ici..."
                }),
                ...getCollaborationExtensions("default")
            ],
            editable
        })

        setTitleEditor(titleEditor)
        setContentEditor(contentEditor)
        contentEditor.on("transaction", () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    forceUpdate()
                })
            })
        })

        return () => {
            titleEditor?.destroy()
            contentEditor?.destroy()
            setTitleEditor(null)
            setContentEditor(null)
        }
    }, [documentId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Container className="editorContainer">
                {titleEditor && (
                    <EditorTitle
                        editor={titleEditor}
                        onKeyDown={handleTitleEditorKeyDown}
                        spellCheck="false"
                    />
                )}
                {contentEditor && (
                    <ContentEditor editor={contentEditor} spellCheck="false" />
                )}
                {contentEditor && <BubbleMenu editor={contentEditor} />}
                {contentEditor && <BlockMenu editor={contentEditor} />}

                {contentEditor && contentEditor.isEditable && (
                    <CalloutEmojiMenu editor={contentEditor} />
                )}
            </Container>
        </>
    )
}

const EditorTitle = styled(EditorContent)`
    .ProseMirror {
        h1 {
            margin: 1rem 0;
            font-weight: 700;
            font-size: 2.25em;
        }
    }
`

const ContentEditor = styled(EditorContent)`
    .ProseMirror {
        font-size: 1em;
        line-height: 1.6rem;

        /**
        * Blocks spacing
        */

        & > *,
        li > *,
        div[data-type="detailsContent"] > *,
        ul[data-type="taskList"] > li > div > *,
        div[data-type="callout"] > .content > *,
        blockquote > * {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
        }

        /**
        * Format
        */
        p {
            font-weight: 400;
            color: #111319;
        }

        p strong,
        summary strong {
            font-weight: 600;
        }

        p code {
            font-weight: 500;
        }

        code {
            padding: 0.2rem 0.2rem 0.1rem;
            background: hsla(0, 0%, 58.8%, 0.1);
            border: 1px solid hsla(0, 0%, 39.2%, 0.2);
            border-radius: 3px;
        }

        a {
            cursor: pointer;
            line-height: 1.6rem;
            color: var(--color-b400);
            border-bottom: 1px solid var(--color-b200);

            &:hover {
                color: var(--color-b500);
            }
        }

        mark {
            background-color: rgb(248, 231, 30) !important;
        }

        /**
        * Blocks
        */
        h1,
        h2,
        h3 {
            color: var(--color-n900);
            font-weight: 700;
            line-height: 2rem;
        }

        h1 {
            font-size: 1.8em;
        }

        h2 {
            font-size: 1.5em;
        }

        h3 {
            font-size: 1.2em;
        }

        blockquote {
            border-left: 3px solid rgb(13, 13, 13);
            padding-left: 1rem;
            margin-left: 0;
            margin-right: 0;
        }

        pre {
            background: var(--color-n100);
            border-radius: 0.25rem;
            color: #000;
            padding: 0.75rem 1.5rem;

            code {
                border: none;
                background: none;
                color: inherit;
                font-size: 0.9rem;
                padding: 0;
                font-family: "JetBrains Mono", monospace;
            }
        }

        ul:not([data-type="taskList"]),
        ol {
            padding-inline-start: 2rem;
            & > li {
                padding-left: 0.25rem;
            }
        }

        ul[data-type="taskList"] {
            list-style: none;
            padding: 0;
            padding-inline-start: 0.15rem;

            li {
                & > label {
                    position: absolute;
                    padding: 0;
                    margin: 0;

                    input {
                        font-size: inherit;
                        font-family: inherit;
                        appearance: none;
                        width: 1.25rem;
                        height: 1.25rem;
                        cursor: pointer;
                        display: inline-block;
                        color: #2563eb;
                        border: 1.5px solid #d0d0d2;
                        border-radius: 4px;
                        background-origin: border-box;
                        background-color: #fff;
                        transition: all 0.15s;

                        &[checked] {
                            border-color: transparent;
                            background-size: 100% 100%;
                            background-position: 50%;
                            background-repeat: no-repeat;
                            background-color: var(--color-black);
                            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 16 16' fill='%23fff' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E");
                        }
                    }
                }

                & > div {
                    margin-left: 2.05rem;
                }
            }
        }

        div[data-type="callout"] {
            display: flex;
            gap: 0.5rem;
            padding: 0.5rem 1.5rem;
            background-color: var(--color-n100);
            border-radius: 0.25rem;

            & > .emoji-wrapper {
                padding-top: 0.25rem;
                display: flex;
                align-items: flex-start;
                flex-shrink: 0;

                & > span {
                    text-align: center;
                    width: 2rem;
                    height: 2rem;
                    margin: 0;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                    cursor: pointer;
                    transition: background-color 0.1s;
                    user-select: none;

                    & > img {
                        width: 100%;
                        pointer-events: none;
                    }

                    &:hover {
                        background-color: var(--color-n300);
                    }
                }
            }

            & > .content {
                width: 100%;
            }
        }

        div[data-type="horizontalRule"] {
            line-height: 0;
            padding: 0.25rem 0;
            margin-top: 0;
            margin-bottom: 0;

            & > div {
                border-bottom: 1px solid #dddddd;
            }
        }

        .details {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            border-radius: 0.25rem;
            padding-left: 0.25rem;

            & > button {
                display: flex;
                flex-shrink: 0;
                cursor: pointer;
                background: transparent;
                border: none;
                border-radius: 0.25rem;
                padding: 0;
                width: 1.5rem;
                padding: 0.4rem;
                transition: background 0.1s;

                &:hover {
                    background: var(--color-n100);
                }

                & > svg {
                    display: block;
                    fill: inherit;
                    flex-shrink: 0;
                    backface-visibility: hidden;
                    transition: transform 200ms ease-out 0s;
                    transform: rotateZ(90deg);
                    opacity: 1;
                }
            }

            &.is-open > button > svg {
                transform: rotateZ(180deg);
            }

            & > div {
                flex: 1 1 auto;
            }

            div[data-type="detailsContent"] > *:last-child {
                margin-bottom: 0;
            }
        }

        div[data-youtube-video] > iframe {
            display: flex;
            width: 100%;
        }

        .tableWrapper {
            overflow-x: auto;
            padding: 2px;
            width: fit-content;
            max-width: 100%;

            table {
                border-collapse: collapse;
                table-layout: fixed;
                margin: 0;
                width: 100%;
                overflow: hidden;

                td,
                th {
                    min-width: 1em;
                    border: 1px solid #d8dae5;
                    padding: 0.25rem 0.5rem;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;

                    > * {
                        margin: 0 !important;
                        padding: 0.25rem 0 !important;
                    }
                }

                th {
                    * {
                        font-weight: 600;
                    }
                    text-align: left;
                    background-color: #f1f3f5;
                }

                .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: rgba(200, 200, 255, 0.4);
                    pointer-events: none;
                }

                .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: -2px;
                    width: 4px;
                    z-index: 99;
                    background-color: #adf;
                    pointer-events: none;
                }
            }

            .tableControls {
                position: absolute;

                .columnsControl,
                .rowsControl {
                    transition: opacity ease-in 100ms;
                    position: absolute;
                    z-index: 99;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .columnsControl {
                    height: 20px;
                    transform: translateY(-50%);

                    > button {
                        color: white;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath fill='%238F95B2' d='M4.5 10.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S6 12.825 6 12s-.675-1.5-1.5-1.5zm15 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S21 12.825 21 12s-.675-1.5-1.5-1.5zm-7.5 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5z'/%3E%3C/svg%3E");
                        width: 30px;
                        height: 15px;
                    }
                }

                .rowsControl {
                    width: 20px;
                    transform: translateX(-50%);

                    > button {
                        color: white;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath fill='%238F95B2' d='M12 3c-.825 0-1.5.675-1.5 1.5S11.175 6 12 6s1.5-.675 1.5-1.5S12.825 3 12 3zm0 15c-.825 0-1.5.675-1.5 1.5S11.175 21 12 21s1.5-.675 1.5-1.5S12.825 18 12 18zm0-7.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5 1.5-.675 1.5-1.5-.675-1.5-1.5-1.5z'/%3E%3C/svg%3E");
                        height: 30px;
                        width: 15px;
                    }
                }

                button {
                    background-color: white;
                    border: 1px solid #d8dae5;
                    border-radius: 2px;
                    background-size: 1.25rem;
                    background-repeat: no-repeat;
                    background-position: center;
                    transition: transform ease-out 100ms,
                        background-color ease-out 100ms;
                    outline: none;

                    box-shadow: rgb(15 15 15 / 10%) 0px 2px 4px;

                    cursor: pointer;

                    &:hover {
                        transform: scale(1.2, 1.2);
                        background-color: var(--color-n50);
                    }
                }

                .tableToolbox,
                .tableColorPickerToolbox {
                    padding: 0.25rem;
                    display: flex;
                    flex-direction: column;
                    width: 200px;
                    gap: 0.25rem;

                    .toolboxItem {
                        background: none;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        border: none;
                        padding: 0.1rem;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.2s;

                        &:hover {
                            background-color: var(--color-n100);
                        }

                        .iconContainer,
                        .colorContainer {
                            border: 1px solid #e6e8f0;
                            border-radius: 3px;
                            padding: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 1.75rem;
                            height: 1.75rem;

                            svg {
                                width: 1rem;
                                height: 1rem;
                            }
                        }

                        .label {
                            font-size: 0.95rem;
                            color: var(--color-black);
                        }
                    }
                }
            }
        }

        &.resize-cursor .tableWrapper .tableControls,
        .tableWrapper.controls--disabled .tableControls {
            .rowsControl,
            .columnsControl {
                opacity: 0;
                pointer-events: none;
            }
        }

        /**
        * Inline
        */
        span[data-type="emoji"] {
            display: inline;
            padding: 0.1rem;

            & > img.emoji {
                height: 1.2rem;
                width: 1.2rem;
                margin: 0 0.05em 0 0.1em;
                vertical-align: -0.2em;
            }
        }

        h1 span[data-type="emoji"] > img.emoji {
            height: 1.8rem;
            width: 1.8rem;
        }

        h2 span[data-type="emoji"] > img.emoji {
            height: 1.5rem;
            width: 1.5rem;
        }

        h3 span[data-type="emoji"] > img.emoji {
            height: 1.2rem;
            width: 1.2rem;
        }

        /**
        * Selections
        */

        // Text selection
        &:not(.ProseMirror-hideselection) *::selection {
            background: rgba(150, 170, 220, 0.3);
            color: inherit;
        }

        // Node selection
        &:not(.dragging) {
            .ProseMirror-selectednode {
                outline: none !important;
                border-radius: 0.2rem;
                background-color: rgba(150, 170, 220, 0.2);
                transition: background-color 0.2s;
                box-shadow: none;

                &.image,
                &.imagePlaceholder,
                &.tableWrapper {
                    background-color: transparent !important;
                    transition: box-shadow ease-out 200ms !important;

                    *::selection {
                        background: none;
                    }
                }

                &.image,
                &.imagePlaceholder {
                    box-shadow: rgb(51, 102, 255, 0.9) 0px 0px 0px 2px !important;
                }

                &.tableWrapper {
                    box-shadow: rgb(51, 102, 255, 0.9) 0px 0px 0px 2px inset !important;
                }
            }
        }

        /**
        * Code highlighting
        */

        pre code span {
            font-family: "JetBrains Mono", monospace;
        }

        code.hljs {
            padding: 3px 5px;
        }
        .hljs {
            background: #f3f3f3;
            color: #444;
        }

        .hljs-comment {
            color: #697070;
            font-style: italic;
        }

        .hljs-punctuation,
        .hljs-tag {
            color: #444a;
        }
        .hljs-tag.hljs-attr {
            color: #c44170;
        }
        .hljs-tag.hljs-name {
            color: #4b71bd;
        }
        .hljs-attribute,
        .hljs-doctag,
        .hljs-keyword,
        .hljs-meta .hljs-keyword,
        .hljs-name,
        .hljs-selector-tag {
            font-weight: 500;
            color: #496eb8;
        }
        .hljs-deletion,
        .hljs-number,
        .hljs-quote,
        .hljs-selector-class,
        .hljs-selector-id,
        .hljs-string,
        .hljs-template-tag,
        .hljs-type {
            color: #886594;
        }
        .hljs-section,
        .hljs-title {
            color: #c44170;
            font-weight: 500;
        }

        .hljs-link,
        .hljs-operator,
        .hljs-regexp,
        .hljs-selector-attr,
        .hljs-selector-pseudo,
        .hljs-symbol,
        .hljs-template-variable,
        .hljs-variable {
            color: #e06c75;
        }
        .hljs-literal {
            color: #695;
        }
        .hljs-addition,
        .hljs-built_in,
        .hljs-bullet,
        .hljs-code,
        .hljs-params {
            color: #c44170;
        }
        .hljs-meta {
            color: #625b6b;
        }
        .hljs-meta .hljs-string {
            color: #38a;
        }
        .hljs-emphasis {
            font-style: italic;
        }
        .hljs-strong {
            font-weight: 500;
        }
    }
`

const Container = styled.div`
    padding: 100px 25px;

    @media print {
        padding: 50px;
    }

    .ProseMirror {
        padding: 25px calc((100% - (700px)) / 2);
        outline: none;

        /* Collaboration cursor */
        .collaboration-cursor__caret {
            border-left: 1px solid #0d0d0d;
            border-right: 1px solid #0d0d0d;

            margin-left: -1px;
            margin-right: -1px;
            position: relative;
            word-break: normal;
            box-sizing: border-box;

            &::after {
                content: "";
                display: block;
                position: absolute;
                left: -8px;
                right: -8px;
                top: 0;
                bottom: 0;
            }

            .collaboration-cursor__label {
                opacity: 0;
                border-radius: 3px 3px 3px 0;
                color: #ffffff;
                font-size: 12px;
                font-style: normal;
                font-weight: 600;
                left: -1px;
                line-height: normal;
                padding: 0.1rem 0.3rem;
                position: absolute;
                top: -1.4em;
                user-select: none;
                white-space: nowrap;
                transition: opacity 100ms ease-in-out;
            }

            &:hover {
                .collaboration-cursor__label {
                    opacity: 1;
                }
            }
        }

        /* Placeholder*/
        & > .is-editor-empty:first-child::before {
            color: #adb5bd;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
        }

        @media print {
            padding: 0;
        }
    }
`
