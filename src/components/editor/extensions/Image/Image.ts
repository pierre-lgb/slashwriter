import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import ImageComponent from "./ImageComponent"
import ImagePlaceholder from "./ImagePlaceholder"

/**
 * Extension based on:
 * - Tiptap Image extension (https://tiptap.dev/api/nodes/image)
 */

export interface ImageOptions {
    allowBase64: boolean
    HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        image: {
            /**
             * Add an image
             */
            setImage: (options: {
                src: string
                alt?: string
                title?: string
            }) => ReturnType
        }
    }
}

export const inputRegex =
    /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const Image = Node.create<ImageOptions>({
    name: "image",

    addOptions() {
        return {
            allowBase64: true,
            HTMLAttributes: {}
        }
    },

    group: "block",

    isolating: true,
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null
            },
            alt: {
                default: null
            },
            title: {
                default: null
            },
            width: {
                default: "fit-content"
            },
            height: {
                default: null
            },
            align: {
                default: "center"
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: this.options.allowBase64
                    ? "img[src]"
                    : 'img[src]:not([src^="data:"])'
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "img",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageComponent)
    },

    addCommands() {
        return {
            setImage:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options
                    })
                }
        }
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: (match) => {
                    const [, , alt, src, title] = match

                    return { src, alt, title }
                }
            })
        ]
    },

    addExtensions() {
        return [ImagePlaceholder]
    }
})
