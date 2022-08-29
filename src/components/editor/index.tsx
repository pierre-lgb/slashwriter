import { TextSelection } from 'prosemirror-state'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import {
    documentsApi,
    useGetDocumentsQuery,
    useRenameDocumentMutation
} from 'src/services/documents'
import { useAppDispatch } from 'src/store'
import styled from 'styled-components'
import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

import { HocuspocusProvider } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import CommandsMenu from './extensions/CommandsMenu'
import suggestion from './extensions/CommandsMenu/suggestion'
import DragAndDrop from './extensions/DragAndDrop'
import Subdocument from './extensions/Subdocument'
import TrailingNode from './extensions/TrailingNode'

function EditorTitle(props: { editor: Editor; documentId: string }) {
    const { editor, documentId } = props
    const [titleEditor, setTitleEditor] = useState<Editor | null>(null)
    const [renameDocument] = useRenameDocumentMutation()
    const { documentTitle } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            documentTitle: (data?.find((d) => d.id === documentId)).title
        })
    })

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
                })
            ],
            content: `<h1>${documentTitle || ""}</h1>`,
            onCreate({ editor }) {
                // Autofocus
                if (!documentTitle) {
                    editor.commands.focus()
                }
            },
            onBlur({ editor, event }) {
                renameDocument({
                    id: documentId,
                    title: editor.getText()
                })
            }
        })

        setTitleEditor(titleEditor)

        return () => {
            if (titleEditor) {
                if (documentTitle !== titleEditor.getText()) {
                    // Rename before unmount
                    renameDocument({
                        id: documentId,
                        title: titleEditor.getText()
                    })
                }
                titleEditor.destroy()
            }
            setTitleEditor(null)
        }
    }, [documentId])

    function handleKeyDown(event) {
        const selection = titleEditor.state.selection
        if (event.shiftKey) {
            return
        }

        if (event.key === "Enter" || event.key === "ArrowDown") {
            editor.commands.focus("start")
        }

        if (event.key === "ArrowRight") {
            if (selection?.$head.nodeAfter === null) {
                editor.commands.focus("start")
            }
        }
    }

    return (
        <div className="document-title">
            <EditorContent
                editor={titleEditor}
                onKeyDown={handleKeyDown}
                spellCheck="false"
            />
        </div>
    )
}

const CURSOR_COLORS = ["#ffb020", "#3366ff", "#474d66"]

const getRandomCursorColor = () =>
    CURSOR_COLORS[Math.round(Math.random() * CURSOR_COLORS.length)]

export default function SlashwriterEditor({ documentId, user }) {
    const [editor, setEditor] = useState<Editor | null>(null)
    const [status, setStatus] = useState("connecting")
    const ydoc = useMemo(() => new Y.Doc(), [documentId])

    const websocketProvider = useMemo(
        () =>
            new HocuspocusProvider({
                name: `document.${documentId}`,
                url: process.env.NEXT_PUBLIC_COLLABORATION_URL,
                document: ydoc,
                // We start the connection inside useLayoutEffect()
                // so that a single connection is started (not two)
                connect: false,
                // The token is retrieved from the cookies server-side,
                // we only set a value for `token` here so that the
                // onAuthenticate hook does not log a warning message.
                token: "token"
            }),
        [documentId, ydoc]
    )

    const localProvider = useMemo(
        () => new IndexeddbPersistence(`document.${documentId}`, ydoc),
        [documentId, ydoc]
    )

    const extensions = useMemo(() => {
        return [
            StarterKit.configure({
                history: false,
                heading: false
            }),
            Heading.configure({
                levels: [1, 2, 3]
            }),
            Highlight,
            TaskItem,
            TaskList,
            Subdocument,
            TrailingNode,
            DragAndDrop,
            CommandsMenu.configure({
                suggestion
            }),
            Placeholder.configure({
                placeholder: "Commencez à écrire ici..."
            }),
            Collaboration.configure({
                document: ydoc
            }),
            CollaborationCursor.configure({
                provider: websocketProvider,
                user: {
                    name: user.email,
                    color: getRandomCursorColor()
                }
            })
        ]
    }, [ydoc])

    useLayoutEffect(() => {
        websocketProvider.connect()

        return () => {
            websocketProvider.destroy()
            localProvider.destroy()
        }
    }, [websocketProvider, localProvider])

    useEffect(() => {
        const editor = new Editor({
            extensions
        })

        setEditor(editor)

        return () => {
            editor?.destroy()
            setEditor(null)
        }
    }, [documentId, extensions])

    return (
        <>
            <EditorTitleStyles>
                <EditorTitle editor={editor} documentId={documentId} />
            </EditorTitleStyles>
            <EditorStyles>
                <EditorContent editor={editor} spellCheck="false" />
            </EditorStyles>
        </>
    )
}

const EditorTitleStyles = styled.div`
    .ProseMirror {
        outline: none;
        font-size: 1em;
        line-height: 1.6em;
        padding: 100px calc((100% - (700px + 50px * 2)) / 2) 0;
        margin: 25px;
        color: var(--color-n900);

        h1.is-editor-empty::before {
            color: #adb5bd;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
        }

        h1 {
            font-size: 2em;
        }
    }
`

const EditorStyles = styled.div`
    .ProseMirror {
        outline: none;
        font-size: 1em;
        line-height: 1.6em;

        padding: 25px calc((100% - (700px + 50px * 2)) / 2);
        margin: 25px;

        /* Blocks styling */
        & > * {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
        }

        p {
            font-weight: 400;
            color: #111319;
        }

        h1,
        h2,
        h3 {
            color: var(--color-n900);
            font-weight: 600;
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

        /* Node selections */
        &:not(.dragging) {
            .ProseMirror-selectednode {
                border-radius: 0.2rem;
                outline: none !important;
                box-shadow: rgb(51, 102, 255, 0.9) 0px 0px 0px 2px;
                transition: box-shadow ease-out 100ms;
            }
        }

        /* Collaboration cursor */
        .collaboration-cursor__caret {
            border-left: 1px solid #0d0d0d;
            border-right: 1px solid #0d0d0d;
            margin-left: -1px;
            margin-right: -1px;
            position: relative;
            word-break: normal;

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
        p.is-editor-empty:first-child::before {
            color: #adb5bd;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
        }
    }
`
