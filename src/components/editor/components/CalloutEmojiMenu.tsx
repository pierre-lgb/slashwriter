import { useCallback, useEffect, useRef, useState } from "react"
import tippy, { Instance } from "tippy.js"

// import { createPopup, PopupPickerController } from "@picmo/popup-picker"
// import Tippy from "@tippyjs/react"
import { Editor, ReactRenderer } from "@tiptap/react"

import EmojiPicker from "./EmojiPicker"

interface CalloutEmojiMenuProps {
    editor: Editor
}

export default function CalloutEmojiMenu(props: CalloutEmojiMenuProps) {
    const { editor } = props
    const { view } = editor
    const emojiPickerRef = useRef<HTMLDivElement>()
    const emojiSearchInputRef = useRef<HTMLInputElement>()
    const popup = useRef<Instance>()
    const calloutPos = useRef(-1)

    const handleClickEmoji = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.matches("[data-emoji-container]")) {
                return
            }

            event.preventDefault()
            calloutPos.current = view.posAtDOM(target, 0) - 1

            popup.current.setProps({
                getReferenceClientRect: () => target.getBoundingClientRect()
            })
            popup.current.show()
        },
        [view]
    )

    const handleSelectEmoji = useCallback(
        (emoji: string) => {
            if (calloutPos.current !== -1) {
                editor.commands.updateCallout({ emoji }, calloutPos.current)
            }
        },
        [editor]
    )

    useEffect(() => {
        if (emojiPickerRef.current) {
            emojiPickerRef.current.remove()
            emojiPickerRef.current.style.visibility = "visible"
        }

        popup.current = tippy(props.editor.view.dom, {
            getReferenceClientRect: null,
            content: emojiPickerRef.current,
            trigger: "manual",
            interactive: true,
            arrow: false,
            placement: "right-start",
            theme: "light-border no-padding",
            maxWidth: 500,
            onShown: () => {
                emojiSearchInputRef.current?.focus()
            }
        })

        return () => {
            popup.current?.destroy()
            popup.current = null
        }
    }, [])

    useEffect(() => {
        document.addEventListener("click", handleClickEmoji)
        return () => {
            document.removeEventListener("click", handleClickEmoji)
        }
    }, [handleClickEmoji])

    return (
        <EmojiPicker
            searchInputRef={emojiSearchInputRef}
            pickerRef={emojiPickerRef}
            onSelectEmoji={handleSelectEmoji}
            style={{ visibility: "hidden" }}
        />
    )
}
