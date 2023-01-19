import { Extension } from "@tiptap/core"

import DragHandle from "./DragHandle"

export interface DragAndDropOptions {}

export const DragAndDrop = Extension.create<DragAndDropOptions>({
    name: "dragAndDrop",

    addProseMirrorPlugins() {
        return [
            DragHandle({
                dragHandleWidth: 24
            })
        ]
    }
})
