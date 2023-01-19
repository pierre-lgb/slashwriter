import { Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        equationBlock: {
            /**
             * Add an equation block
             */
            setEquationBlock: () => ReturnType
        }
    }
}

export interface EquationBlockOptions {
    /**
     * Custom HTML attributes that should be added to the rendered HTML tag.
     */
    HTMLAttributes: Record<string, any>
    Component: any
}

export const inputRegex = /(?:^|\s)((?:\$\$)((?:[^$]+))(?:\$\$))$/

export default Node.create({
    name: "equationBlock",

    addOptions() {
        return {
            HTMLAttributes: {},
            Component: null
        }
    },

    group: "block",

    atom: true,

    addAttributes() {
        return {
            katex: {
                default: "",
                parseHTML: (element) => element.innerHTML.split("$")[1]
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: "div",
                getAttrs: (node: HTMLElement) => {
                    return node.hasAttribute("data-katex") ? {} : false
                }
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            {},
            ["div", { "data-katex": true }, `$${HTMLAttributes.katex}$`]
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(this.options.Component)
    },

    renderText({ node }) {
        return node.attrs.katex
    },

    addCommands() {
        return {
            setEquationBlock:
                (attributes?: Record<string, any>) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: attributes
                    })
                }
        }
    }
})
