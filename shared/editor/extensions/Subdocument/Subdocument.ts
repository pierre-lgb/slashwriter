import { Plugin, PluginKey } from "prosemirror-state"
import { ySyncPluginKey } from "y-prosemirror"

import { CommandProps, mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

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

interface SubdocumentProps {
    HTMLAttributes: Record<string, any>
    Component: any

    /**
     * Event triggered when a subdocument node is removed.
     * Can be used to remove the subdocument from the database as well.
     * @param id The id of the deleted subdocument
     * @returns
     */
    onDeleteSubdocument: (id: string) => any
}

export const Subdocument = Node.create<SubdocumentProps>({
    name: "subdocument",

    group: "block",

    addOptions() {
        return {
            Component: null,
            HTMLAttributes: {},
            onDeleteSubdocument: () => {}
        }
    },

    addAttributes() {
        return {
            docId: {
                type: "string",
                isRequired: true
            }
        }
    },

    parseHTML() {
        return [{ tag: `div[data-type="${this.name}"]`, ignore: true }]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-type": this.name })
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(this.options.Component)
    },

    addCommands() {
        return {
            insertSubdocument: (docId: string) => (props: CommandProps) => {
                return props.commands.insertContent({
                    type: "subdocument",
                    attrs: {
                        docId
                    }
                })
            }
        }
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

                    try {
                        const replaceSteps: any[] = []
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
                                    (node) => {
                                        if (node.type.name === "subdocument") {
                                            this.options.onDeleteSubdocument(
                                                node.attrs.docId
                                            )
                                        }
                                    }
                                )
                            })
                        })

                        return true
                    } catch (error) {
                        console.error(error)
                        return true
                    }
                }
            })
        ]
    }
})
