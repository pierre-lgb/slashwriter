import { Extension } from '@tiptap/core'

import DragHandle from './plugins/DragHandle'

export interface DragAndDropOptions {}

export default Extension.create<DragAndDropOptions>({
    name: "drag-and-drop",

    addProseMirrorPlugins(this) {
        return [
            DragHandle({
                dragHandleWidth: 24
            })
        ]
    }
})