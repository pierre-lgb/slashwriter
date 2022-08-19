import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'

import { HocuspocusProvider } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Editor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import CommandsMenu from './extensions/CommandsMenu'
import suggestion from './extensions/CommandsMenu/suggestion'
import Subdocument from './extensions/Subdocument'
import TrailingNode from './extensions/TrailingNode'

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
        <div className="editor">
            <EditorContent editor={editor} />
        </div>
    )
}
