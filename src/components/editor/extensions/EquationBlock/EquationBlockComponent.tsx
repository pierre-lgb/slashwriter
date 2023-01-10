import "katex/dist/katex.min.css"

import katex from "katex"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import Tippy from "@tippyjs/react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

export default function EquationComponent(props: NodeViewProps) {
    const { node, updateAttributes, editor, getPos } = props
    const equationResultContainer = useRef()
    const equationPreviewContainer = useRef()
    const [error, setError] = useState(null)
    const [preview, setPreview] = useState(null)

    const textAreaRef = useRef<HTMLTextAreaElement>()

    const [editMode, setEditMode] = useState<boolean>(false)

    useEffect(() => {
        setError("")
        try {
            katex.render(node.attrs.katex, equationResultContainer.current, {
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
                katex.render(preview, equationPreviewContainer.current, {
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
            visible={editMode}
            onShown={() => {
                textAreaRef.current.focus()
                textAreaRef.current.select()
            }}
            animation="shift-away"
            duration={[200, 0]}
            maxWidth="none"
            content={
                <EquationTextArea
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
                            selectionStart === textAreaRef.current.value.length
                        ) {
                            editor.commands.focus(getPos() + node.nodeSize)
                        }
                    }}
                    onChange={(e) => {
                        setPreview(e.target.value)
                    }}
                ></EquationTextArea>
            }
        >
            <Equation
                data-katex="true"
                className={[
                    props.selected ? "selected" : "",
                    error ? "error" : "",
                    (editMode && !preview.trim().length) ||
                    (!editMode && !node.attrs.katex.trim().length)
                        ? "empty"
                        : ""
                ].join(" ")}
            >
                <div
                    style={{
                        display: editMode && preview.length ? undefined : "none"
                    }}
                    ref={equationPreviewContainer}
                ></div>
                <div
                    style={{ display: editMode ? "none" : undefined }}
                    ref={equationResultContainer}
                ></div>
                {((editMode && !preview.trim().length) ||
                    (!editMode && !node.attrs.katex.trim().length)) && (
                    <div>Équation vide</div>
                )}
                {error && <div>Équation non valide</div>}
            </Equation>
        </Tippy>
    )
}

const Equation = styled(NodeViewWrapper)`
    display: block;
    text-align: center;
    padding: 0.05rem;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: rgb(55, 53, 47);
    border-radius: 4px;
    transition: background-color 0.2s;
    margin: 0 0.1rem;

    .base {
        margin: 2px 0;
    }

    & > div {
        margin: 1rem 0;
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
    width: 400px;
    max-width: calc(100vw - 20px);
    margin: 0;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: var(--color-n50);

    * {
        transition: all 0.1s;
    }
`
