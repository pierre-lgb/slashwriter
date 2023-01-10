import { useEffect, useRef, useState } from "react"
import {
    RiBold as BoldIcon,
    RiCodeSLine as CodeIcon,
    RiItalic as ItalicIcon,
    RiLink as LinkIcon,
    RiLinkUnlink as UnlinkIcon,
    RiMarkPenLine as HighlightIcon,
    RiStrikethrough as StrikethroughIcon,
    RiSubscript as SubscriptIcon,
    RiSuperscript as SuperscriptIcon,
    RiUnderline as UnderlineIcon
} from "react-icons/ri"
import Button from "src/components/ui/Button"
import styled from "styled-components"

import { BubbleMenu as TiptapBubbleMenu, Editor, isNodeSelection } from "@tiptap/react"

import { isCellSelection } from "../extensions/Table/utilities/isCellSelection"

interface BubbleMenuProps {
    editor: Editor
}

export default function BubbleMenu(props: BubbleMenuProps) {
    const { editor } = props

    const menuRef = useRef<HTMLDivElement>()

    /**
     * Keep track of whether the user is selecting with the mouse
     * to prevent glitch with the bubble menu when hovering it
     */
    const [isSelecting, setIsSelecting] = useState(false)
    useEffect(() => {
        function handleMouseDown() {
            function handleMouseMove() {
                if (!editor.state.selection.empty) {
                    setIsSelecting(true)
                    document.removeEventListener("mousemove", handleMouseMove)
                }
            }

            function handleMouseUp() {
                setIsSelecting(false)

                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousedown", handleMouseDown)

        return () => {
            document.removeEventListener("mousedown", handleMouseDown)
        }
    }, [])

    return (
        <TiptapBubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 100,
                theme: "light-border no-padding",
                arrow: false,
                appendTo: "parent",
                animation: "shift-away",
                inertia: true
            }}
            shouldShow={({ view, state, editor }) => {
                const { selection } = state

                const { empty } = selection
                const hasEditorFocus = view.hasFocus()

                if (
                    !hasEditorFocus ||
                    empty ||
                    !editor.isEditable ||
                    isNodeSelection(selection) ||
                    isCellSelection(selection) ||
                    isSelecting
                ) {
                    return false
                }

                return true
            }}
        >
            {isSelecting ? null : (
                <Container ref={menuRef}>
                    <Button
                        icon={<BoldIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleBold().run()
                        }}
                        active={editor.isActive("bold")}
                    />
                    <Button
                        icon={<ItalicIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleItalic().run()
                        }}
                        active={editor.isActive("italic")}
                    />
                    <Button
                        icon={<UnderlineIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleUnderline().run()
                        }}
                        active={editor.isActive("underline")}
                    />
                    <Button
                        icon={<StrikethroughIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleStrike().run()
                        }}
                        active={editor.isActive("strike")}
                    />
                    <Button
                        icon={<CodeIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleCode().run()
                        }}
                        active={editor.isActive("code")}
                    />
                    <Button
                        icon={<HighlightIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleHighlight().run()
                        }}
                        active={editor.isActive("highlight")}
                    />
                    <Button
                        icon={<SubscriptIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleSubscript().run()
                        }}
                        active={editor.isActive("subscript")}
                    />
                    <Button
                        icon={<SuperscriptIcon size={16} />}
                        appearance="text"
                        size="small"
                        onClick={() => {
                            editor.chain().focus().toggleSuperscript().run()
                        }}
                        active={editor.isActive("superscript")}
                    />

                    <Button
                        icon={
                            editor.isActive("link") ? (
                                <UnlinkIcon size={16} />
                            ) : (
                                <LinkIcon size={16} />
                            )
                        }
                        appearance="text"
                        size="small"
                        onClick={() => {
                            if (editor.isActive("link")) {
                                editor.chain().focus().unsetLink().run()
                            } else {
                                const href = prompt("Entrez l'URL :")
                                if (href) {
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleLink({ href })
                                        .run()
                                }
                            }
                        }}
                        active={editor.isActive("link")}
                    />
                </Container>
            )}
        </TiptapBubbleMenu>
    )
}

const Container = styled.div`
    padding: 0.25rem;
    display: flex;
    gap: 0.25rem;

    &:empty {
        display: none;
        pointer-events: none;
    }
`
