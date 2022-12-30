import { Extension } from "@tiptap/core"

import DragHandle from "./DragHandle"

export interface DragAndDropOptions {}

export const DragAndDrop = Extension.create<DragAndDropOptions>({
    name: "drag-and-drop",

    addProseMirrorPlugins() {
        return [
            DragHandle({
                dragHandleWidth: 24
            })
        ]
    }
})
