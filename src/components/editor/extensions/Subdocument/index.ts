import { Plugin, PluginKey } from 'prosemirror-state'
import { ReplaceStep } from 'prosemirror-transform'
import api from 'src/services'
import { documentsApi } from 'src/services/documents'
import store from 'src/store'

import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import Component from './Component'

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        subdocument: {
            /**
             * Inserts a subdocument with the given document id
             */
            insertSubdocument: (docId: string) => ReturnType
        }
    }
}

export default Node.create({
    name: "subdocument",
    addAttributes() {
        return {
            docId: {
                type: "string",
                isRequired: true
            }
        }
    },

    group: "block",
    // atom: true,

    parseHTML() {
        return [{ tag: "div" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes)]
    },

    addCommands() {
        return {
            insertSubdocument: (docId) => (props) => {
                return props.commands.insertContent({
                    type: "subdocument",
                    attrs: {
                        docId
                    }
                })
            }
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },

    onTransaction(this, { transaction }) {
        // console.log(transaction.selection)
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey(),
                filterTransaction: (tr, state) => {
                    const replaceSteps = []
                    tr.steps.forEach((step, index) => {
                        if (step.toJSON().stepType === "replace") {
                            replaceSteps.push(index)
                        }
                    })

                    replaceSteps.forEach((index) => {
                        const map = tr.mapping.maps[index]
                        map.forEach((oldStart, oldEnd) => {
                            state.doc.nodesBetween(
                                oldStart,
                                oldEnd,
                                (node, pos) => {
                                    if (node.type.name === "subdocument") {
                                        store.dispatch(
                                            documentsApi.endpoints.deleteDocument.initiate(
                                                {
                                                    id: node.attrs.docId
                                                }
                                            )
                                        )
                                    }
                                }
                            )
                        })
                    })

                    return true
                }
            })
        ]
    }
})
