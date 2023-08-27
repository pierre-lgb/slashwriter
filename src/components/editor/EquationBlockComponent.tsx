import "katex/dist/katex.min.css"

import katex from "katex"
import { useEffect, useRef, useState } from "react"

import Tippy from "@tippyjs/react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import styles from "./EquationBlockComponent.module.scss"

export default function EquationBlockComponent(props: NodeViewProps) {
    const { node, updateAttributes, editor, getPos } = props
    const equationResultContainer = useRef<HTMLDivElement>(null)
    const equationPreviewContainer = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const [editMode, setEditMode] = useState<boolean>(false)

    useEffect(() => {
        setError("")
        try {
            katex.render(node.attrs.katex, equationResultContainer.current!, {
                displayMode: true,
                strict: false
            })
        } catch (error) {
            console.error(error)
            setError(error)
        }
    }, [node.attrs.katex])

    useEffect(() => {
        if (editMode) {
            setError("")
            try {
                katex.render(preview || "", equationPreviewContainer.current!, {
                    displayMode: true,
                    strict: false
                })
            } catch (error) {
                console.error(error)
                setError(error)
            }
        } else if (!editMode && preview !== null) {
            if (!preview.trim().length) {
                return props.deleteNode()
            }
            updateAttributes({
                katex: preview
            })
        }
    }, [preview, editMode])

    useEffect(() => {
        setEditMode(!!props.selected)
        if (props.selected) {
            setPreview(node.attrs.katex)
        }
    }, [props.selected])

    return (
        <Tippy
            theme="light-border no-padding"
            placement="bottom-start"
            arrow={false}
            interactive
            appendTo={"parent"}
            visible={editMode && editor.isEditable}
            onShown={() => {
                textAreaRef.current?.focus()
                textAreaRef.current?.select()
            }}
            animation="shift-away"
            duration={[200, 0]}
            maxWidth="none"
            content={
                <textarea
                    className={styles.equationTextarea}
                    ref={textAreaRef}
                    draggable="false"
                    value={preview ?? ""}
                    placeholder={"e^{i\\pi} + 1 = 0"}
                    onBlur={(e) => {
                        e.preventDefault()
                    }}
                    onKeyDown={(e) => {
                        if (
                            e.key === "Escape" ||
                            (e.key === "Enter" && !e.shiftKey)
                        ) {
                            return editor.commands.focus(
                                getPos() + node.nodeSize
                            )
                        }

                        if (!textAreaRef.current) return

                        const { selectionStart, selectionEnd } =
                            textAreaRef.current

                        if (
                            (e.key === "ArrowLeft" || e.key === "ArrowUp") &&
                            selectionStart === selectionEnd &&
                            selectionStart === 0
                        ) {
                            editor.commands.focus(getPos() - 1)
                        }

                        if (
                            (e.key === "ArrowRight" || e.key === "ArrowDown") &&
                            selectionStart === selectionEnd &&
                            selectionStart === textAreaRef.current?.value.length
                        ) {
                            editor.commands.focus(getPos() + node.nodeSize)
                        }
                    }}
                    onChange={(e) => {
                        setPreview(e.target.value)
                    }}
                ></textarea>
            }
        >
            <NodeViewWrapper
                data-katex="true"
                className={[
                    styles.equationBlock,
                    props.selected ? styles.selected : "",
                    error ? styles.error : "",
                    (editMode && !preview?.trim().length) ||
                    (!editMode && !node.attrs.katex.trim().length)
                        ? styles.empty
                        : ""
                ].join(" ")}
            >
                <div
                    style={{
                        display:
                            editMode && preview?.length ? undefined : "none"
                    }}
                    ref={equationPreviewContainer}
                ></div>
                <div
                    style={{ display: editMode ? "none" : undefined }}
                    ref={equationResultContainer}
                ></div>
                {((editMode && !preview?.trim().length) ||
                    (!editMode && !node.attrs.katex.trim().length)) && (
                    <div>Empty equation</div>
                )}
                {error && <div>Invalid equation</div>}
            </NodeViewWrapper>
        </Tippy>
    )
}
