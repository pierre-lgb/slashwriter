import { CommandProps, mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react"

import ImagePlaceholderComponent from "./ImagePlaceholderComponent"

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        imagePlaceholder: {
            /**
             * Inserts an image placeholder
             */
            insertImagePlaceholder: (docId: string) => ReturnType
        }
    }
}

export default Node.create({
    name: "imagePlaceholder",

    group: "block",

    atom: true,

    parseHTML() {
        return [{ tag: `div[data-type="${this.name}"]` }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImagePlaceholderComponent)
    },

    addCommands() {
        return {
            insertImagePlaceholder: () => (props: CommandProps) => {
                return props.commands.insertContent({
                    type: "imagePlaceholder"
                })
            }
        }
    }
})
