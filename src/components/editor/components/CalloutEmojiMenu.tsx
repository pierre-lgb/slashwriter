import { useCallback, useEffect, useRef, useState } from "react"
import { FixedSizeList } from "react-window"
import tippy, { Instance } from "tippy.js"

import { Editor } from "@tiptap/react"

import EmojiPicker, { EmojiPickerHandle } from "./EmojiPicker"

interface CalloutEmojiMenuProps {
    editor: Editor
}

export default function CalloutEmojiMenu(props: CalloutEmojiMenuProps) {
    const { editor } = props
    const { view } = editor
    const emojiListRef = useRef<FixedSizeList>()
    const emojiPickerRef = useRef<EmojiPickerHandle>()
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
            const { containerElement } = emojiPickerRef.current
            containerElement.remove()
            containerElement.style.visibility = "visible"
        }

        popup.current = tippy(view.dom, {
            getReferenceClientRect: null,
            content: emojiPickerRef.current.containerElement,
            appendTo: view.dom.parentElement,
            trigger: "manual",
            interactive: true,
            arrow: false,
            placement: "right-start",
            animation: "shift-away",
            theme: "light-border no-padding",
            maxWidth: 500,
            onShown: () => {
                emojiPickerRef.current?.searchInputElement?.focus()
            },
            onHidden: () => {
                emojiPickerRef.current?.scrollTo(0)
                emojiPickerRef.current?.setQuery("")
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
        <EmojiPicker ref={emojiPickerRef} onSelectEmoji={handleSelectEmoji} />
    )
}
