// @ts-nocheck
import { h } from "jsx-dom-cjs"
import { Node as ProseMirrorNode } from "prosemirror-model"
import { Decoration, NodeView } from "prosemirror-view"

import { Editor } from "@tiptap/core"
import { TableMap } from "@tiptap/prosemirror-tables"

export function updateColumns(
    node: ProseMirrorNode,
    colgroup: Element,
    table: Element,
    cellMinWidth: number,
    overrideCol?: number,
    overrideValue?: any
) {
    let totalWidth = 0
    let fixedWidth = true
    let nextDOM = colgroup.firstChild
    const row = node.firstChild

    for (let i = 0, col = 0; i < row.childCount; i += 1) {
        const { colspan, colwidth } = row.child(i).attrs

        for (let j = 0; j < colspan; j += 1, col += 1) {
            const hasWidth =
                overrideCol === col ? overrideValue : colwidth && colwidth[j]
            const cssWidth = hasWidth ? `${hasWidth}px` : ""

            totalWidth += hasWidth || cellMinWidth

            if (!hasWidth) {
                fixedWidth = false
            }

            if (!nextDOM) {
                colgroup.appendChild(
                    document.createElement("col")
                ).style.width = cssWidth
            } else {
                if (nextDOM.style.width !== cssWidth) {
                    nextDOM.style.width = cssWidth
                }

                nextDOM = nextDOM.nextSibling
            }
        }
    }

    while (nextDOM) {
        const after = nextDOM.nextSibling

        nextDOM.parentNode.removeChild(nextDOM)
        nextDOM = after
    }

    if (fixedWidth) {
        table.style.width = `${totalWidth}px`
        table.style.minWidth = ""
    } else {
        table.style.width = ""
        table.style.minWidth = `${totalWidth}px`
    }
}

export class TableView implements NodeView {
    node: ProseMirrorNode
    cellMinWidth: number
    decorations: Decoration[]
    editor: Editor
    getPos: () => number
    hoveredCell
    map: TableMap
    dom: Element
    table: Element
    colgroup: Element
    tbody: Element
    rowsControl: Element
    columnsControl: Element
    controls: Element
    contentDOM: HTMLElement
    destroyList: Array<() => void> = []

    constructor(
        node: ProseMirrorNode,
        cellMinWidth: number,
        decorations: Decoration[],
        editor: Editor,
        getPos: () => number
    ) {
        this.node = node
        this.cellMinWidth = cellMinWidth
        this.decorations = decorations
        this.editor = editor
        this.getPos = getPos
        this.hoveredCell = null
        this.map = TableMap.get(node)

        /**
         * DOM
         */

        // // Controllers
        // this.rowsControl = h(
        //     "div",
        //     { className: "rowsControl" },
        //     h("button", {
        //         onClick: () => this.selectRow()
        //     })
        // )

        // this.columnsControl = h(
        //     "div",
        //     { className: "columnsControl" },
        //     h("button", {
        //         onClick: () => this.selectColumn()
        //     })
        // )

        // this.controls = h(
        //     "div",
        //     { className: "table-controls", contentEditable: "false" },
        //     this.rowsControl,
        //     this.columnsControl
        // )

        // Table

        this.colgroup = h("colgroup")
        this.tbody = h("tbody")
        this.table = h("table", null, this.colgroup, this.tbody)

        this.dom = h("div", { className: "tableWrapper controls--disabled" }, [
            this.controls,
            this.table
        ])

        this.contentDOM = this.tbody

        updateColumns(node, this.colgroup, this.table, cellMinWidth)
    }

    update(node: ProseMirrorNode) {
        if (node.type !== this.node.type) {
            return false
        }

        this.node = node
        updateColumns(node, this.colgroup, this.table, this.cellMinWidth)

        return true
    }

    ignoreMutation(
        mutation: MutationRecord | { type: "selection"; target: Element }
    ) {
        return (
            mutation.type === "attributes" &&
            (mutation.target === this.table ||
                this.colgroup.contains(mutation.target))
        )
    }

    selectColumn() {
        console.log("SELECT COLUMN")
    }

    selectRow() {
        console.log("SELECT ROW")
    }

    destroy() {
        this.destroyList.forEach((removeEventListener) => removeEventListener())
    }
}
