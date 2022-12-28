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
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import Text from "@tiptap/extension-text"
import Underline from "@tiptap/extension-underline"
import Youtube from "@tiptap/extension-youtube"
import { Editor, EditorContent } from "@tiptap/react"

import BubbleMenu from "./components/BubbleMenu"
import Collaboration from "./extensions/Collaboration/Collaboration"
import CollaborationCursor from "./extensions/Collaboration/CollaborationCursor"
import CommandsMenu from "./extensions/CommandsMenu"
import suggestion from "./extensions/CommandsMenu/suggestion"
import DragAndDrop from "./extensions/DragAndDrop"
import HorizontalRule from "./extensions/HorizontalRule"
import Image from "./extensions/Image"
import Subdocument from "./extensions/Subdocument"
import Details from "./extensions/tiptap-pro/Details/Details"
import DetailsContent from "./extensions/tiptap-pro/Details/DetailsContent"
import DetailsSummary from "./extensions/tiptap-pro/Details/DetailsSummary"
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
                DetailsSummary,
                DetailsContent,

                // Format
                Bold,
                Italic,
                Strike,
                Underline,
                Highlight,
                Link,
                Code,

                // Extensions
                TrailingNode,
                DragAndDrop,
                HardBreak,
                Youtube,
                Dropcursor.configure({
                    width: 3,
                    color: "#BFE5F4"
                }),
                CommandsMenu.configure({
                    suggestion
                }),
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
        <Container>
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
        </Container>
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

        & > * {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
        }

        p {
            font-weight: 400;
            color: #111319;
        }

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

        li > p {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
        }

        p strong {
            font-weight: 600;
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

        blockquote {
            border-left: 3px solid rgb(13, 13, 13);
            padding-left: 1rem;
            margin-left: 0;
            margin-right: 0;
        }

        code {
            padding: 0.2rem 0.2rem 0.1rem;
            background: hsla(0, 0%, 58.8%, 0.1);
            border: 1px solid hsla(0, 0%, 39.2%, 0.2);
            border-radius: 3px;
        }

        p code {
            font-weight: 500;
        }

        mark {
            background-color: rgb(248, 231, 30);
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

        &:not(.ProseMirror-hideselection) *::selection {
            background: rgba(150, 170, 220, 0.3);
            color: inherit;
        }

        .details {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            border-radius: 0.25rem;
            padding: 0.25rem 0;

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

                & > div > * {
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
            }

            :last-child {
                margin-bottom: 0;
            }
        }

        div[data-youtube-video] > iframe {
            display: flex;
            width: 100%;
        }

        /* Node selections */
        &:not(.dragging) {
            .ProseMirror-selectednode {
                outline: none !important;
                border-radius: 0.2rem;
                background-color: rgba(150, 170, 220, 0.2);
                transition: background-color ease-out 150ms;
                box-shadow: none;

                &.image,
                &.imagePlaceholder {
                    background-color: transparent !important;
                    transition: box-shadow ease-out 100ms !important;
                    box-shadow: rgb(51, 102, 255, 0.9) 0px 0px 0px 2px !important;

                    *::selection {
                        background: none;
                    }
                }
            }
        }
    }
`

/*
style="width: 0.6875em; height: 0.6875em; display: block; fill: inherit; flex-shrink: 0; backface-visibility: hidden; transition: transform 200ms ease-out 0s; transform: rotateZ(90deg); opacity: 1;"
*/
/* .details {
            display: flex;
            margin: 1rem 0;
            border: 1px solid black;
            border-radius: 0.5rem;
            padding: 0.5rem;

            & > button {
                display: flex;
                cursor: pointer;
                background: transparent;
                border: none;
                padding: 0;

                &::before {
                    content: "\25B6";
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1.5em;
                    height: 1.5em;
                }
            }

            &.is-open > button::before {
                content: "\25BC";
            }

            & > div {
                flex: 1 1 auto;
            }

            :last-child {
                margin-bottom: 0;
            }
        } */

const Container = styled.div`
    padding: 100px 25px;

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
    }
`
