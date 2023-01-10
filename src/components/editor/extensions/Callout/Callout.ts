import { Fragment, Node as ProsemirrorNode, Slice } from "prosemirror-model"
import { TextSelection } from "prosemirror-state"
import twemoji from "twemoji"

import {
    Editor,
    findParentNode,
    isTextSelection,
    mergeAttributes,
    Node,
    wrappingInputRule
} from "@tiptap/core"

/**
 * Extension based on:
 * - https://github.com/remirror/remirror/blob/main/packages/remirror__extension-callout/
 */

export interface CalloutOptions {
    /**
     * The default emoji passed to attributes when none is provided.
     */
    defaultEmoji: string

    renderEmoji: (
        node: ProsemirrorNode,
        editor: Editor,
        getPos: () => number
    ) => HTMLElement
    /**
     * Custom HTML attributes that should be added to the rendered HTML tag.
     */
    HTMLAttributes: {
        [key: string]: any
    }
}

export interface CalloutAttributes {
    /**
     * The emoji of the callout.
     */
    emoji?: string
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        callout: {
            /**
             * Toggle a callout node.
             *
             * @param attributes
             * @returns
             */
            toggleCallout: (attributes: CalloutAttributes) => ReturnType

            /**
             * Update the attributes of a callout
             *
             * @param attributes
             * @returns
             */
            updateCallout: (
                attributes: CalloutAttributes,
                pos?: number
            ) => ReturnType
        }
    }
}

const defaultEmojiRenderer = (node) => {
    const dom = document.createElement("span")
    dom.dataset.emojiContainer = ""
    dom.textContent = node.attrs.emoji
    twemoji.parse(dom, {
        folder: "svg",
        ext: ".svg",
        //  https://github.com/twitter/twemoji/issues/580
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
    })

    // Prevent ProseMirror from handling the `mousedown` event so that the cursor
    // won't move when users click the emoji.
    dom.addEventListener("mousedown", (e) => e.preventDefault())

    return dom
}

export const Callout = Node.create<CalloutOptions>({
    name: "callout",

    addOptions() {
        return {
            defaultEmoji: "",
            renderEmoji: defaultEmojiRenderer,
            HTMLAttributes: {}
        }
    },

    content: "block+",

    group: "block",

    defining: true,

    addAttributes() {
        return {
            emoji: {
                default: this.options.defaultEmoji
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: `div[data-type="${this.name}"]`,
                getAttrs: (node: HTMLElement) => {
                    return {
                        emoji: node.getAttribute("data-emoji") ?? "",
                        content: node.textContent
                    }
                }
            }
        ]
    },

    renderHTML({ HTMLAttributes, node }) {
        return [
            "div",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                "data-type": this.name,
                "data-emoji": node.attrs.emoji
            }),
            0
        ]
    },

    addNodeView() {
        return ({ editor, getPos, node }) => {
            const dom = document.createElement("div")
            dom.setAttribute("data-type", this.name)

            const contentDOM = document.createElement("div")
            contentDOM.classList.add("content")

            const { emoji } = node.attrs
            if (emoji) {
                const emojiWrapper = document.createElement("div")
                const emojiNode = this.options.renderEmoji(
                    node,
                    editor,
                    getPos as () => number
                )

                dom.setAttribute("data-emoji", emoji)
                emojiWrapper.classList.add("emoji-wrapper", "twemoji")
                emojiWrapper.setAttribute("contenteditable", "false")

                if (emojiNode) {
                    emojiWrapper.append(emojiNode)
                    dom.append(emojiWrapper)
                }
            }

            dom.append(contentDOM)
            return {
                dom,
                contentDOM
            }
        }
    },

    addCommands() {
        return {
            toggleCallout: (attributes) => (editor) => {
                return editor.commands.toggleWrap(this.name, attributes)
            },
            updateCallout: (attributes, pos) => (editor) => {
                const { tr, dispatch } = editor

                if (dispatch) {
                    tr.setNodeMarkup(pos, undefined, attributes)
                }

                return true
            }
        }
    },

    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const { state, view } = editor
                const { selection } = state

                if (!(isTextSelection(selection) && selection.empty)) {
                    return false
                }

                const { nodeBefore, parent } = selection.$from

                if (
                    !nodeBefore ||
                    !nodeBefore.isText ||
                    !parent.type.isTextblock
                ) {
                    return false
                }

                const regex = /^:::([A-Za-z]*)?$/
                const { text, nodeSize } = nodeBefore
                const { textContent } = parent

                if (!text) {
                    return false
                }

                const matchesNodeBefore = text.match(regex)
                const matchesParent = textContent.match(regex)

                if (!matchesNodeBefore || !matchesParent) {
                    return false
                }

                const pos = selection.$from.before()
                const end = pos + nodeSize + 1
                // +1 to account for the extra pos a node takes up

                const { tr } = state
                const slice = new Slice(Fragment.from(this.type.create()), 0, 1)
                tr.replace(pos, end, slice)

                // Set the selection to within the callout
                tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)))
                view.dispatch(tr)

                return true
            },

            /**
             * Handle the backspace key when deleting content.
             * Aims to stop merging callouts when deleting content in between.
             */
            Backspace: ({ editor }) => {
                const { state, view } = editor
                const { selection } = state

                // If the selection is not empty, return false
                // and let other extension handle the deletion.
                if (!selection.empty) {
                    return false
                }

                const { $from } = selection

                // If not at the start of current node, no joining will happen
                if ($from.parentOffset !== 0) {
                    return false
                }

                const previousPosition = $from.before($from.depth) - 1

                // If nothing above to join with
                if (previousPosition < 1) {
                    return false
                }

                const previousPos = state.doc.resolve(previousPosition)

                // If resolving previous position fails, bail out
                if (!previousPos?.parent) {
                    return false
                }

                const previousNode = previousPos.parent
                const { node, pos, depth } = findParentNode(() => true)(
                    selection
                )

                // If current node is nested
                if (depth !== 1) {
                    return false
                }

                // If previous node is a callout, cut current node's content into it
                if (
                    node.type !== this.type &&
                    previousNode.type === this.type
                ) {
                    const { content, nodeSize } = node
                    const { tr } = state

                    tr.delete(pos, pos + nodeSize)
                    tr.setSelection(
                        TextSelection.near(tr.doc.resolve(previousPosition - 1))
                    )
                    tr.insert(previousPosition - 1, content)

                    view.dispatch(tr)

                    return true
                }
                return false
            }
        }
    },

    addInputRules() {
        return [
            wrappingInputRule({
                find: /^::: $/,
                type: this.type
            })
        ]
    }
})
