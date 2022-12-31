import { useCallback, useEffect, useRef, useState } from "react"
import { MdOutlineFontDownload as HighlightIcon } from "react-icons/md"
import {
    RiBold as BoldIcon,
    RiCodeSLine as CodeIcon,
    RiItalic as ItalicIcon,
    RiLink as LinkIcon,
    RiLinkUnlink as UnlinkIcon,
    RiStrikethrough as StrikethroughIcon,
    RiSubscript as SubscriptIcon,
    RiSuperscript as SuperscriptIcon,
    RiUnderline as UnderlineIcon
} from "react-icons/ri"
import Button from "src/components/ui/Button"
import styled from "styled-components"

import { BubbleMenu as TiptapBubbleMenu, Editor, isNodeSelection } from "@tiptap/react"

interface BubbleMenuProps {
    editor: Editor
}

export default function BubbleMenu(props: BubbleMenuProps) {
    const menuRef = useRef<HTMLDivElement>()

    const [isSelecting, setIsSelecting] = useState(false)

    /**
     * Keep track of whether the user is selecting with the mouse
     * to prevent glitch with the bubble menu when hovering it
     */
    useEffect(() => {
        function handleMouseDown() {
            function handleMouseMove() {
                if (!props.editor.state.selection.empty) {
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
            editor={props.editor}
            tippyOptions={{
                duration: 100,
                theme: "light-border no-padding",
                arrow: false,
                appendTo: "parent",
                animation: "shift-away",
                inertia: true
            }}
            shouldShow={({ view, state, from, to, editor }) => {
                const { selection } = state

                const { empty } = selection
                const hasEditorFocus = view.hasFocus()

                if (
                    !hasEditorFocus ||
                    empty ||
                    !editor.isEditable ||
                    isNodeSelection(selection) ||
                    isSelecting
                ) {
                    return false
                }

                return true
            }}
        >
            {isSelecting ? null : (
                <Container ref={menuRef}>
                    {props.editor.can().chain().focus().toggleBold().run() && (
                        <Button
                            icon={<BoldIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor.chain().focus().toggleBold().run()
                            }}
                            active={props.editor.isActive("bold")}
                        />
                    )}
                    {props.editor
                        .can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run() && (
                        <Button
                            icon={<ItalicIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor
                                    .chain()
                                    .focus()
                                    .toggleItalic()
                                    .run()
                            }}
                            active={props.editor.isActive("italic")}
                        />
                    )}
                    {props.editor
                        .can()
                        .chain()
                        .focus()
                        .toggleUnderline()
                        .run() && (
                        <Button
                            icon={<UnderlineIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor
                                    .chain()
                                    .focus()
                                    .toggleUnderline()
                                    .run()
                            }}
                            active={props.editor.isActive("underline")}
                        />
                    )}
                    {props.editor
                        .can()
                        .chain()
                        .focus()
                        .toggleStrike()
                        .run() && (
                        <Button
                            icon={<StrikethroughIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor
                                    .chain()
                                    .focus()
                                    .toggleStrike()
                                    .run()
                            }}
                            active={props.editor.isActive("strike")}
                        />
                    )}
                    {props.editor.can().chain().focus().toggleCode().run() && (
                        <Button
                            icon={<CodeIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor.chain().focus().toggleCode().run()
                            }}
                            active={props.editor.isActive("code")}
                        />
                    )}
                    {props.editor
                        .can()
                        .chain()
                        .focus()
                        .toggleHighlight()
                        .run() && (
                        <Button
                            icon={<HighlightIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor
                                    .chain()
                                    .focus()
                                    .toggleHighlight()
                                    .run()
                            }}
                            active={props.editor.isActive("highlight")}
                        />
                    )}
                    {props.editor
                        .can()
                        .chain()
                        .focus()
                        .toggleSubscript()
                        .run() && (
                        <Button
                            icon={<SubscriptIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor
                                    .chain()
                                    .focus()
                                    .toggleSubscript()
                                    .run()
                            }}
                            active={props.editor.isActive("subscript")}
                        />
                    )}
                    {props.editor
                        .can()
                        .chain()
                        .focus()
                        .toggleSuperscript()
                        .run() && (
                        <Button
                            icon={<SuperscriptIcon size={16} />}
                            appearance="text"
                            size="small"
                            onClick={() => {
                                props.editor
                                    .chain()
                                    .focus()
                                    .toggleSuperscript()
                                    .run()
                            }}
                            active={props.editor.isActive("superscript")}
                        />
                    )}
                    {props.editor
                        .can()
                        .chain()
                        .focus()
                        .toggleLink({ href: "" })
                        .run() && (
                        <Button
                            icon={
                                props.editor.isActive("link") ? (
                                    <UnlinkIcon size={16} />
                                ) : (
                                    <LinkIcon size={16} />
                                )
                            }
                            appearance="text"
                            size="small"
                            onClick={() => {
                                if (props.editor.isActive("link")) {
                                    props.editor
                                        .chain()
                                        .focus()
                                        .unsetLink()
                                        .run()
                                } else {
                                    const href = prompt("Entrez l'URL :")
                                    if (href) {
                                        props.editor
                                            .chain()
                                            .focus()
                                            .toggleLink({ href })
                                            .run()
                                    }
                                }
                            }}
                            active={props.editor.isActive("link")}
                        />
                    )}
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
