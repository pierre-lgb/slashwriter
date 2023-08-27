import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    RiDeleteBin7Line as DeleteIcon,
    RiFileCopyLine as DuplicateIcon
} from "react-icons/ri"
import tippy, { Instance } from "tippy.js"

import { Editor } from "@tiptap/react"

import styles from "./BlockMenu.module.scss"

interface BlockMenuProps {
    editor: Editor
}

export default function BlockMenu(props: BlockMenuProps) {
    const { editor } = props
    const { view } = editor
    const menuRef = useRef<HTMLDivElement>(null)
    const popup = useRef<Instance | null>(null)

    const handleClickDragHandle = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.matches("[data-drag-handle]")) {
                popup.current?.hide()
                return
            }

            event.preventDefault()

            popup.current?.setProps({
                getReferenceClientRect: () => target.getBoundingClientRect()
            })

            popup.current?.show()
        },
        [view]
    )

    const handleKeyDown = () => {
        popup.current?.hide()
    }

    useEffect(() => {
        if (menuRef.current) {
            menuRef.current.remove()
            menuRef.current.style.visibility = "visible"

            popup.current = tippy(view.dom, {
                getReferenceClientRect: null,
                content: menuRef.current,
                appendTo: "parent",
                trigger: "manual",
                interactive: true,
                arrow: false,
                placement: "top-start",
                animation: "shift-away",
                theme: "light-border no-padding",
                maxWidth: 500,
                hideOnClick: true,
                onShown: () => {
                    menuRef.current?.focus()
                }
            })
        }

        return () => {
            popup.current?.destroy()
            popup.current = null
        }
    }, [])

    useEffect(() => {
        document.addEventListener("click", handleClickDragHandle)
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("click", handleClickDragHandle)
            document.addEventListener("keydown", handleKeyDown)
        }
    }, [handleClickDragHandle])

    return (
        <div className={styles.blockMenu} ref={menuRef}>
            <button
                className={styles.action}
                onClick={() => {
                    editor.commands.deleteSelection()
                    popup.current?.hide()
                }}
            >
                <div className={styles.actionIconContainer}>
                    <DeleteIcon />
                </div>
                <div className={styles.actionName}>Delete</div>
            </button>

            <button
                className={styles.action}
                onClick={() => {
                    const { view } = editor
                    const { state } = view
                    const { selection } = state

                    editor
                        .chain()
                        .insertContentAt(
                            selection.to,
                            selection.content().content.firstChild!.toJSON(),
                            {
                                updateSelection: true
                            }
                        )
                        .focus(selection.to)
                        .run()

                    popup.current?.hide()
                }}
                disabled={
                    editor.state.selection.content().content.firstChild?.type
                        .name === "subdocument"
                }
            >
                <div className={styles.actionIconContainer}>
                    <DuplicateIcon />
                </div>
                <div className={styles.actionName}>Duplicate</div>
            </button>
        </div>
    )
}
