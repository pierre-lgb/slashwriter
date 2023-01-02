import "katex/dist/katex.min.css"

import katex from "katex"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Instance, Props } from "tippy.js"

import Tippy from "@tippyjs/react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

export default function EquationComponent(props: NodeViewProps) {
    const { node, updateAttributes, editor, getPos } = props
    const equationResultContainer = useRef()
    const equationPreviewContainer = useRef()
    const [error, setError] = useState(null)
    const [preview, setPreview] = useState("")
    const [popup, setPopup] = useState<Instance<Props>>()

    const textAreaRef = useRef<HTMLTextAreaElement>()

    const [editMode, setEditMode] = useState<boolean>(false)

    useEffect(() => {
        setError("")
        try {
            katex.render(node.attrs.katex, equationResultContainer.current)
        } catch (error) {
            console.error(error)
            setError(error)
        }
    }, [node.attrs.katex])

    useEffect(() => {
        if (editMode) {
            setError("")
            try {
                katex.render(preview, equationPreviewContainer.current)
            } catch (error) {
                console.error(error)
                setError(error)
            }
        }
    }, [preview, editMode])

    useEffect(() => {
        setEditMode(!!props.selected)
        setPreview(node.attrs.katex)
        popup?.show()
    }, [props.selected])

    return (
        <Tippy
            theme="light-border no-padding"
            placement="bottom-start"
            arrow={false}
            interactive
            appendTo={"parent"}
            onShown={() => {
                textAreaRef.current.focus()
                textAreaRef.current.select()
            }}
            onHide={() => {
                if (!preview.length) {
                    return props.deleteNode()
                }

                updateAttributes({
                    katex: preview
                })
                setEditMode(false)
            }}
            trigger="manual"
            animation="shift-away"
            duration={[200, 0]}
            content={
                <EquationTextArea
                    ref={textAreaRef}
                    draggable="false"
                    value={preview}
                    placeholder={"e^{i\\pi} + 1 = 0"}
                    onKeyDown={(e) => {
                        if (
                            e.key === "Escape" ||
                            (e.key === "Enter" && !e.shiftKey)
                        ) {
                            popup?.hide()
                            return editor.commands.focus(
                                getPos() + node.nodeSize
                            )
                        }

                        const { selectionStart, selectionEnd } =
                            textAreaRef.current

                        if (
                            e.key === "ArrowLeft" &&
                            selectionStart === selectionEnd &&
                            selectionStart === 0
                        ) {
                            popup?.hide()
                            editor.commands.focus(getPos())
                        }

                        if (
                            e.key === "ArrowRight" &&
                            selectionStart === selectionEnd &&
                            selectionStart === textAreaRef.current.value.length
                        ) {
                            popup?.hide()
                            editor.commands.focus(getPos() + node.nodeSize)
                        }
                    }}
                    onChange={(e) => {
                        setPreview(e.target.value)
                    }}
                ></EquationTextArea>
            }
            onCreate={(instance) => setPopup(instance)}
        >
            <Equation
                data-katex="true"
                className={[
                    props.selected ? "selected" : "",
                    error ? "error" : "",
                    (editMode && !preview.length) ||
                    (!editMode && !node.attrs.katex.length)
                        ? "empty"
                        : ""
                ].join(" ")}
            >
                <div
                    style={{ display: editMode ? undefined : "none" }}
                    ref={equationPreviewContainer}
                ></div>
                <div
                    style={{ display: editMode ? "none" : undefined }}
                    ref={equationResultContainer}
                ></div>
                {((editMode && !preview.length) ||
                    (!editMode && !node.attrs.katex.length)) && (
                    <div>Équation vide</div>
                )}
                {error && <div>Équation non valide</div>}
            </Equation>
        </Tippy>
    )
}

const Equation = styled(NodeViewWrapper)`
    display: inline-block;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    border-radius: 4px;
    transition: background-color 0.2s;
    padding: 0 0.25rem;
    margin: 0 0.1rem;

    div[data-tippy-root] {
        display: inline;
    }

    &.empty {
        color: var(--color-n600);
        background-color: var(--color-n100);
    }

    &.error {
        color: var(--color-red);
        background-color: var(--color-n100);
    }

    &:not(.error, .empty) * {
        font-family: KaTeX_Main, Times New Roman, serif;
    }

    &.selected {
        background-color: rgba(150, 170, 220, 0.2);
    }
`

const EquationTextArea = styled.textarea`
    font-family: "JetBrains Mono", monospace;
    outline: none;
    resize: none;
    font-size: 0.95rem;
    border: none;
    margin: none;
    height: 200px;
    width: 300px;
    margin: 0;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: var(--color-n50);

    * {
        transition: all 0.1s;
    }
`
