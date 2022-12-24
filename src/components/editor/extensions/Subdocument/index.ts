import { Plugin, PluginKey } from "prosemirror-state"
import { documentsApi } from "src/services/documents"
import store from "src/store"
import { ySyncPluginKey } from "y-prosemirror"

import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import Component from "./Component"

declare module "@tiptap/core" {
    /* eslint-disable unused-imports/no-unused-vars */
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

    parseHTML() {
        return [{ tag: "div", ignore: true }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes)]
    },

    addCommands() {
        return {
            insertSubdocument: (docId: string) => (props) => {
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

    addPasteRules() {
        // TODO : Add paste rules.
        return []
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey(),
                props: {
                    handleDrop(view, event, slice) {
                        if (event.ctrlKey === true) {
                            // TODO : When dropping a "subdocument" that has been duplicated
                            // with Ctrl + Drag, create a duplicate in the database too.
                        }
                    }
                    // transformPasted(slice) {
                    //     // TODO : Duplicate on database too.
                    //     // Note : a document with the given ID may exist in the database even if
                    //     // the user doesn't have access to.

                    //     // const test = new Promise(resolve => setTimeout(resolve, 3000));

                    //     return slice
                    // }
                },
                filterTransaction: (tr, state) => {
                    if (
                        tr.getMeta("uiEvent") === "drop" ||
                        tr.getMeta(ySyncPluginKey) !== undefined
                    ) {
                        return true
                    }

                    const replaceSteps = []
                    tr.steps.forEach((step, index) => {
                        if (step.toJSON().stepType === "replace") {
                            replaceSteps.push(index)
                        }
                    })

                    replaceSteps.forEach((index) => {
                        const map = tr.mapping.maps[index]
                        map.forEach((oldStart, oldEnd) => {
                            state.doc.nodesBetween(oldStart, oldEnd, (node) => {
                                if (node.type.name === "subdocument") {
                                    store.dispatch(
                                        documentsApi.endpoints.deleteDocument.initiate(
                                            {
                                                id: node.attrs.docId
                                            }
                                        )
                                    )
                                }
                            })
                        })
                    })

                    return true
                }
            })
        ]
    }
})
