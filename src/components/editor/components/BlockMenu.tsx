import { useCallback, useEffect, useRef, useState } from "react"
import { RiDeleteBin7Line as DeleteIcon, RiFileCopyLine as DuplicateIcon } from "react-icons/ri"
import Button from "src/components/ui/Button"
import styled from "styled-components"
import tippy, { Instance } from "tippy.js"

import { Editor } from "@tiptap/react"

interface BlockMenuProps {
    editor: Editor
}

export default function BlockMenu(props: BlockMenuProps) {
    const { editor } = props
    const { view } = editor
    const menuRef = useRef<HTMLDivElement>()
    const popup = useRef<Instance>()

    const handleClickDragHandle = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.matches("[data-drag-handle]")) {
                return
            }

            event.preventDefault()
            // calloutPos.current = view.posAtDOM(target, 0) - 1

            popup.current.setProps({
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
        }

        popup.current = tippy(view.dom, {
            getReferenceClientRect: null,
            content: menuRef.current,
            appendTo: view.dom.parentElement,
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
        <Container ref={menuRef}>
            <Action
                onClick={() => {
                    editor.commands.deleteSelection()
                    popup.current.hide()
                }}
            >
                <ActionIcon>
                    <DeleteIcon />
                </ActionIcon>
                <ActionText>Supprimer</ActionText>
            </Action>

            <Action
                onClick={() => {
                    const { view } = editor
                    const { state } = view
                    const { tr, selection } = state

                    editor
                        .chain()
                        .insertContentAt(
                            selection.to,
                            selection.content().content.firstChild.toJSON(),
                            {
                                updateSelection: true
                            }
                        )
                        .focus(selection.to)
                        .run()
                    popup.current.hide()
                }}
                disabled={
                    editor.state.selection.content().content.firstChild?.type
                        .name === "subdocument"
                }
            >
                <ActionIcon>
                    <DuplicateIcon />
                </ActionIcon>
                <ActionText>Dupliquer</ActionText>
            </Action>
        </Container>
    )
}

const Container = styled.div`
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    width: 200px;
    gap: 0.25rem;
`

const Action = styled.button`
    background: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    padding: 0.1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
        cursor: not-allowed;
    }

    &:hover {
        background-color: var(--color-n100);
    }
`

const ActionIcon = styled.div`
    width: 1.75rem;
    height: 1.75rem;
    border: 1px solid var(--color-n300);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ActionText = styled.div`
    font-family: inherit;
    font-size: 0.95rem;
`
