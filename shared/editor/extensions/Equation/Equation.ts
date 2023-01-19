import { Node, nodeInputRule, wrappingInputRule } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        equation: {
            /**
             * Add an inline equation
             */
            setEquation: () => ReturnType
        }
    }
}

export interface EquationOptions {
    /**
     * Custom HTML attributes that should be added to the rendered HTML tag.
     */
    HTMLAttributes: Record<string, any>
    Component: any
}

export const inputRegex = /(?:^|\s)((?:\$\$)((?:[^$]+))(?:\$\$))$/

export default Node.create({
    name: "equation",

    addOptions() {
        return {
            HTMLAttributes: {},
            Component: null
        }
    },

    group: "inline",

    inline: true,

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
                tag: "span",
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
            ["span", { "data-katex": true }, `$${HTMLAttributes.katex}$`]
        ]
    },

    renderText({ node }) {
        return node.attrs.katex
    },

    addNodeView() {
        return ReactNodeViewRenderer(this.options.Component)
    },

    addCommands() {
        return {
            setEquation:
                (attributes?: Record<string, any>) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: attributes
                    })
                }
        }
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: (match) => ({
                    katex: match[1].replaceAll("$", "")
                })
            })
        ]
    }
})
