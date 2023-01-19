import { CommandProps, mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react"

export interface ImagePlaceholderOptions {
    HTMLAttributes: Record<string, any>
    Component: any
}

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

export default Node.create<ImagePlaceholderOptions>({
    name: "imagePlaceholder",

    addOptions() {
        return {
            HTMLAttributes: {},
            Component: null
        }
    },

    group: "block",

    atom: true,

    parseHTML() {
        return [{ tag: `div[data-type="${this.name}"]` }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(this.options.Component)
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
