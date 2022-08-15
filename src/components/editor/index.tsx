// import 'remirror/styles/core.css'

// import { useRouter } from 'next/router'
// import { useCallback, useLayoutEffect, useState } from 'react'
// import { BoldExtension, ItalicExtension, YjsExtension } from 'remirror/extensions'
// import { useUser } from 'src/utils/supabase'
// import { IndexeddbPersistence } from 'y-indexeddb'
// import { WebsocketProvider } from 'y-websocket'
// import * as Y from 'yjs'

// import { HocuspocusProvider } from '@hocuspocus/provider'
// import { Remirror, useRemirror } from '@remirror/react'

// import { CollaborationExtension } from './extensions/CollaborationExtension'

// const ydoc = new Y.Doc()
// const remoteProvider = new WebsocketProvider(process.env.NEXT_PUBLIC_COLLABORATION_URL, "doc.test", ydoc)

// function Editor({
//     createExtensions = () => []
// }) {
//     const { manager } = useRemirror({
//         extensions: createExtensions,
//         core: {
//             excludeExtensions: ["history"]
//         }
//     })

//     return (
//         <div className='remirror-theme'>
//             <Remirror manager={manager} autoFocus autoRender/>
//         </div>
//     )

// }

// function CollaborativeEditor({ documentId, ...props }) {
//     const [ydoc] = useState(new Y.Doc())
//     const { user } = useUser()
//     // const [remoteProvider, setRemoteProvider] = useState(null)
//     const router = useRouter()

//     useLayoutEffect(() => {
//         const name = `doc.${documentId}`

//         const localProvider = new IndexeddbPersistence(name, ydoc)
//         // const remoteProvider = new HocuspocusProvider({
//         //     url: process.env.NEXT_PUBLIC_COLLABORATION_URL,
//         //     name: name,
//         //     document: ydoc,
//         //     // Token is fetched server-side from the cookies,
//         //     // we only set a value here so that onAuthenticate()
//         //     // hook is triggered correctly.
//         //     token: "token",

//         //     onAuthenticationFailed: () => {
//         //         alert("Vous n'avez pas accès à ce document.")
//         //         router.push("/")
//         //     }
//         // })
//         // const remoteProvider = new WebsocketProvider(process.env.NEXT_PUBLIC_COLLABORATION_URL, name, ydoc)

//         // setRemoteProvider(remoteProvider)

//         return () => {
//             remoteProvider.destroy()
//             localProvider.destroy()
//             // setRemoteProvider(null)
//         }
//     }, [documentId, ydoc])

//     const createExtensions = useCallback(() => {
//         return [
//             new BoldExtension({}),
//             new ItalicExtension({}),
//             // new YjsExtension({
//             //     getProvider: () => remoteProvider
//             // })
//             // new CollaborationExtension({
//             //     provider: remoteProvider,
//             //     user: {
//             //         name: user?.email,
//             //         color: "#000000"
//             //     }
//             // })
//         ]
//     }, [remoteProvider, user])

//     return !!remoteProvider ? (
//         <>
//             <Editor createExtensions={createExtensions} />
//         </>
//     ) : (
//         <strong>Initialisation de l'éditeur collaboratif...</strong>
//     )
// }

// export default CollaborativeEditor

import { useLayoutEffect, useMemo, useState } from 'react'
import { useUser } from 'src/utils/supabase'
import * as Y from 'yjs'

import { HocuspocusProvider } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

function BaseEditor({ extensions = [], children }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                history: false
            }),
            Highlight,
            Typography,
            ...extensions
        ]
    })

    return children?.(editor) || <EditorContent editor={editor} />
}

const CURSOR_COLORS = ["#ffb020", "#3366ff", "#474d66"]

const getRandomCursorColor = () =>
    CURSOR_COLORS[Math.round(Math.random() * CURSOR_COLORS.length)]

function DocumentEditor({ documentId }) {
    const { user } = useUser()
    const [ydoc] = useState(new Y.Doc())
    const [websocketProvider, setWebsocketProvider] = useState(null)
    const [status, setStatus] = useState("connecting")

    useLayoutEffect(() => {
        const documentName = `document.${documentId}`
        const websocketProvider = new HocuspocusProvider({
            name: documentName,
            url: process.env.NEXT_PUBLIC_COLLABORATION_URL,
            document: ydoc,
            token: "token"
        })

        websocketProvider.on("status", ({ status }) => {
            setStatus(status)
        })

        setWebsocketProvider(websocketProvider)
    }, [])

    const collaborationExtensions = useMemo(() => {
        if (!websocketProvider || !user) return null

        return [
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
    }, [websocketProvider, user])

    return !!collaborationExtensions ? (
        <BaseEditor extensions={collaborationExtensions}>
            {(editor: Editor) => (
                <div className="editor">
                    {/* {status === "connected" ? (
                        <div>
                            {editor.storage.collaborationCursor.users.length}{" "}
                            utilisateur(s) connectés
                        </div>
                    ) : (
                        <div>
                            Vous êtes hors connexion. Vos modifications sont
                            sauvegardées dans le navigateur en attendant que
                            vous soyez de nouveau connecté à internet.
                        </div>
                    )} */}
                    <EditorContent editor={editor} />
                </div>
            )}
        </BaseEditor>
    ) : null
}

export default DocumentEditor
