import hljs from "highlight.js/lib/common"
import { getHighlightDecorations, highlightPlugin } from "prosemirror-highlightjs"
import { Plugin, PluginKey, Selection, TextSelection } from "prosemirror-state"
import { DecorationSet } from "prosemirror-view"

import { findParentNode, mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core"

/**
 * Extension based on:
 * - Tiptap CodeBlock extension (https://tiptap.dev/api/nodes/code-block)
 */

export interface CodeBlockOptions {
    /**
     * Adds a prefix to language classes that are applied to code tags.
     * Defaults to `'language-'`.
     */
    languageClassPrefix: string

    /**
     * Custom HTML attributes that should be added to the rendered HTML tag.
     */
    HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        codeBlock: {
            /**
             * Set a code block
             */
            setCodeBlock: (attributes?: { language: string }) => ReturnType
            /**
             * Toggle a code block
             */
            toggleCodeBlock: (attributes?: { language: string }) => ReturnType
        }
    }
}

export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/
export const tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/

export default Node.create({
    name: "codeBlock",

    addOptions() {
        return {
            languageClassPrefix: "language-",
            HTMLAttributes: {}
        }
    },

    content: "text*",

    marks: "",

    group: "block",

    code: true,

    defining: true,

    addAttributes() {
        return {
            language: {
                default: null,
                parseHTML: (element) => {
                    const { languageClassPrefix } = this.options
                    const classNames = [
                        ...(element.firstElementChild?.classList || [])
                    ]
                    const languages = classNames
                        .filter((className) =>
                            className.startsWith(languageClassPrefix)
                        )
                        .map((className) =>
                            className.replace(languageClassPrefix, "")
                        )
                    const language = languages[0]

                    if (!language) {
                        return null
                    }

                    return language
                },
                rendered: false
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: "pre",
                preserveWhitespace: "full"
            }
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "pre",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            [
                "code",
                {
                    class: node.attrs.language
                        ? this.options.languageClassPrefix + node.attrs.language
                        : null
                },
                0
            ]
        ]
    },

    addCommands() {
        return {
            setCodeBlock: (attributes) => (editor) => {
                return editor.commands.setNode(this.name, attributes)
            },
            toggleCodeBlock: (attributes) => (editor) => {
                return editor.commands.toggleNode(
                    this.name,
                    "paragraph",
                    attributes
                )
            }
        }
    },

    addKeyboardShortcuts() {
        return {
            "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
            /**
             * When using Mod-A shorcut inside a code block it should select
             * all the code block's content (instead of the whole editor's one)
             */
            "Mod-a": () => {
                const { selection } = this.editor.state
                const { $anchor } = selection

                if ($anchor.parent.type.name !== this.name) {
                    return false
                }

                const { start, node } = findParentNode(
                    (node) => node.type.name === "codeBlock"
                )(selection)

                return this.editor.commands.setTextSelection({
                    from: start,
                    to: start + node.nodeSize - 1
                })
            },

            // Remove code block when at start of document or code block is empty
            Backspace: () => {
                const { empty, $anchor } = this.editor.state.selection
                const isAtStart = $anchor.pos === 1

                if (!empty || $anchor.parent.type.name !== this.name) {
                    return false
                }

                if (isAtStart || !$anchor.parent.textContent.length) {
                    return this.editor.commands.clearNodes()
                }

                return false
            },

            // Exit node on triple enter
            Enter: ({ editor }) => {
                if (!this.options.exitOnTripleEnter) {
                    return false
                }

                const { state } = editor
                const { selection } = state
                const { $from, empty } = selection

                if (!empty || $from.parent.type !== this.type) {
                    return false
                }

                const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
                const endsWithDoubleNewline =
                    $from.parent.textContent.endsWith("\n\n")

                if (!isAtEnd || !endsWithDoubleNewline) {
                    return false
                }

                return editor
                    .chain()
                    .command(({ tr }) => {
                        tr.delete($from.pos - 2, $from.pos)

                        return true
                    })
                    .exitCode()
                    .run()
            },

            Tab: ({ editor }) => {
                const { state } = editor
                const { selection, doc } = state
                const { $from, empty } = selection

                if (!empty || $from.parent.type !== this.type) {
                    return false
                }

                return editor.commands.insertContent("    ")
            },

            // Exit node on arrow down
            ArrowDown: ({ editor }) => {
                const { state } = editor
                const { selection, doc } = state
                const { $from, empty } = selection

                if (!empty || $from.parent.type !== this.type) {
                    return false
                }

                const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

                if (!isAtEnd) {
                    return false
                }

                const after = $from.after()

                if (after === undefined) {
                    return false
                }

                const nodeAfter = doc.nodeAt(after)

                if (nodeAfter) {
                    return false
                }

                return editor.commands.exitCode()
            }
        }
    },

    addInputRules() {
        return [
            textblockTypeInputRule({
                find: backtickInputRegex,
                type: this.type,
                getAttributes: (match) => ({
                    language: match[1]
                })
            }),
            textblockTypeInputRule({
                find: tildeInputRegex,
                type: this.type,
                getAttributes: (match) => ({
                    language: match[1]
                })
            })
        ]
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey("codeHighlighting"),
                state: {
                    init: (_, { doc }) => {
                        let content = getHighlightDecorations(
                            doc,
                            hljs,
                            ["codeBlock"],
                            () => undefined
                        )

                        return DecorationSet.create(doc, content)
                    },
                    apply: (tr, decorationSet) => {
                        if (!tr.docChanged) {
                            return decorationSet.map(tr.mapping, tr.doc)
                        }

                        let content = getHighlightDecorations(
                            tr.doc,
                            hljs,
                            ["codeBlock"],
                            () => undefined
                        )

                        return DecorationSet.create(tr.doc, content)
                    }
                },
                props: {
                    decorations(state) {
                        return this.getState(state)
                    }
                }
            }),
            // this plugin creates a code block for pasted content from VS Code
            // we can also detect the copied code language
            new Plugin({
                key: new PluginKey("codeBlockVSCodeHandler"),
                props: {
                    handlePaste: (view, event) => {
                        if (!event.clipboardData) {
                            return false
                        }

                        // don’t create a new code block within code blocks
                        if (this.editor.isActive(this.type.name)) {
                            return false
                        }

                        const text = event.clipboardData.getData("text/plain")
                        const vscode =
                            event.clipboardData.getData("vscode-editor-data")
                        const vscodeData = vscode
                            ? JSON.parse(vscode)
                            : undefined
                        const language = vscodeData?.mode

                        if (!text || !language) {
                            return false
                        }

                        const { tr } = view.state

                        // create an empty code block
                        tr.replaceSelectionWith(this.type.create({ language }))

                        // put cursor inside the newly created code block
                        tr.setSelection(
                            TextSelection.near(
                                tr.doc.resolve(
                                    Math.max(0, tr.selection.from - 2)
                                )
                            )
                        )

                        // add text to code block
                        // strip carriage return chars from text pasted as code
                        // see: https://github.com/ProseMirror/prosemirror-view/commit/a50a6bcceb4ce52ac8fcc6162488d8875613aacd
                        tr.insertText(text.replace(/\r\n?/g, "\n"))

                        // store meta information
                        // this is useful for other plugins that depends on the paste event
                        // like the paste rule plugin
                        tr.setMeta("paste", true)

                        view.dispatch(tr)

                        return true
                    }
                }
            })
        ]
    }
})

export function arrowHandler(dir: "left" | "right" | "up" | "down") {
    return ({ editor }) => {
        const { view, state } = editor
        const { dispatch } = view
        const { tr } = state

        if (!view) {
            return false
        }

        if (!(tr.selection.empty && view.endOfTextblock(dir))) {
            return false
        }

        const side = dir === "left" || dir === "up" ? -1 : 1
        const $head = tr.selection.$head
        const nextPos = Selection.near(
            tr.doc.resolve(side > 0 ? $head.after() : $head.before()),
            side
        )

        if (nextPos.$head && nextPos.$head.parent.type.name === "codeMirror") {
            dispatch?.(tr.setSelection(nextPos))
            return true
        }

        return false
    }
}
