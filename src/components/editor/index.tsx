import { TextSelection } from 'prosemirror-state'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import {
    documentsApi,
    useGetDocumentsQuery,
    useRenameDocumentMutation
} from 'src/services/documents'
import { useAppDispatch } from 'src/store'
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

    const dispatch = useAppDispatch()

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
            },
            onUpdate({ editor, transaction }) {
                // Live updating the cache to see the changes wherever
                // there is this title on the UI (header, sidebar,...)
                dispatch(
                    documentsApi.util.updateQueryData(
                        "getDocuments",
                        null,
                        (draft) => {
                            const doc = draft.find((d) => d.id === documentId)
                            Object.assign(doc, {
                                ...doc,
                                title: editor.getText()
                            })
                        }
                    )
                )
            }
        })

        setTitleEditor(titleEditor)

        return () => {
            titleEditor?.destroy()
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
                history: false
            }),
            Highlight,
            TaskItem,
            TaskList,
            Subdocument,
            TrailingNode,
            DragAndDrop,
            Placeholder.configure({
                placeholder: "Commencez à écrire ici..."
            }),
            CommandsMenu.configure({
                suggestion
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
            <EditorTitle editor={editor} documentId={documentId} />

            <div className="editor">
                <EditorContent editor={editor} spellCheck="false" />
            </div>
        </>
    )
}
