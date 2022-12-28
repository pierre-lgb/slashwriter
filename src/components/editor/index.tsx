import { KeyboardEvent, useEffect, useLayoutEffect, useMemo, useState } from "react"
import styled from "styled-components"
import { IndexeddbPersistence } from "y-indexeddb"
import * as Y from "yjs"

import { HocuspocusProvider } from "@hocuspocus/provider"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import Document from "@tiptap/extension-document"
import Dropcursor from "@tiptap/extension-dropcursor"
import Heading from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import Text from "@tiptap/extension-text"
import { Editor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import CommandsMenu from "./extensions/CommandsMenu"
import suggestion from "./extensions/CommandsMenu/suggestion"
import DragAndDrop from "./extensions/DragAndDrop"
import { HorizontalRule } from "./extensions/HorizontalRule"
import Image from "./extensions/Image"
import Subdocument from "./extensions/Subdocument"
import TrailingNode from "./extensions/TrailingNode"

function getRandomColor() {
    const COLORS = ["#ffb020", "#3366ff", "#474d66"]
    return COLORS[Math.round(Math.random() * (COLORS.length - 1))]
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
    const [_, setStatus] = useState("connecting")

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
                StarterKit.configure({
                    history: false,
                    heading: false,
                    gapcursor: false,
                    horizontalRule: false,
                    dropcursor: false
                }),
                Heading.configure({
                    levels: [1, 2, 3]
                }),
                Highlight,
                HorizontalRule,
                TaskItem,
                TaskList,
                Image,
                Subdocument,
                TrailingNode,
                DragAndDrop,
                Link,
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

        return () => {
            titleEditor?.destroy()
            contentEditor?.destroy()
            setTitleEditor(null)
            setContentEditor(null)
        }
    }, [documentId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container>
            {titleEditor && !titleEditor.isDestroyed && (
                <EditorTitle
                    editor={titleEditor}
                    onKeyDown={handleTitleEditorKeyDown}
                    spellCheck="false"
                />
            )}
            {contentEditor && !contentEditor.isDestroyed && (
                <ContentEditor editor={contentEditor} spellCheck="false" />
            )}
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

        /* Blocks styling */
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
            font-size: 1rem;
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
        }

        code {
            padding: 0.2rem 0.2rem 0.1rem;
            background: hsla(0, 0%, 58.8%, 0.1);
            border: 1px solid hsla(0, 0%, 39.2%, 0.2);
            border-radius: 3px;
            font-weight: 500;
        }

        .horizontal-rule {
            line-height: 0;
            padding: 0.25rem 0;
            margin-top: 0;
            margin-bottom: 0;

            & > div {
                border-bottom: 1px solid #dddddd;
            }
        }

        *::selection {
            background: rgba(150, 170, 220, 0.3);
            color: inherit;
        }

        /* Node selections */
        &:not(.dragging) {
            .ProseMirror-selectednode {
                & .image {
                    outline: none !important;
                    box-shadow: rgb(51, 102, 255, 0.9) 0px 0px 0px 2px;
                    transition: box-shadow ease-out 100ms;
                    background-color: transparent;
                }

                border-radius: 0.2rem;
                background-color: rgba(150, 170, 220, 0.2);
                transition: background-color ease-out 150ms;
                box-shadow: none;
            }
        }
    }
`

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
