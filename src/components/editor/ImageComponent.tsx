import { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react"
import { AiOutlineColumnWidth as FullWidthIcon } from "react-icons/ai"
import {
    TbLayoutAlignCenter as AlignCenterIcon,
    TbLayoutAlignLeft as AlignLeftIcon,
    TbLayoutAlignRight as AlignRightIcon
} from "react-icons/tb"
import Button from "src/components/ui/Button"
import styled from "styled-components"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

export default function ImageComponent(props: NodeViewProps) {
    const { node, editor } = props
    const imageRef = useRef<HTMLImageElement>()
    const [resizing, setResizing] = useState<boolean>(false)
    const [resizeInitialWidth, setResizeInitialWidth] = useState<number>(null)
    const [resizeInitialMouseX, setResizeInitialMouseX] = useState<number>(null)

    function startResize(event: ReactMouseEvent<HTMLDivElement>) {
        event.preventDefault()
        setResizing(true)
        setResizeInitialMouseX(event.clientX)
        setResizeInitialWidth(imageRef.current.offsetWidth)
    }

    function resize(event: MouseEvent) {
        if (!resizing) {
            return
        }

        event.preventDefault()

        const dx = event.clientX - resizeInitialMouseX
        const newWidth = Math.max(resizeInitialWidth + dx, 150) // Minimum width: 150

        props.updateAttributes({
            width: newWidth
        })
    }

    function endResize() {
        setResizing(false)
        setResizeInitialMouseX(null)
        setResizeInitialWidth(null)
    }

    useEffect(() => {
        window.addEventListener("mousemove", resize)
        window.addEventListener("mouseup", endResize)

        return () => {
            window.removeEventListener("mousemove", resize)
            window.removeEventListener("mouseup", endResize)
        }
    }, [resizing, resizeInitialMouseX, resizeInitialWidth]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ImageNodeViewWrapper
            className={
                props.selected ? "ProseMirror-selectednode image" : "image"
            }
            style={{ width: node.attrs.width }}
            align={node.attrs.align}
        >
            <ImageContainer className={resizing ? "resizing" : null}>
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    title={node.attrs.title}
                />

                {editor.isEditable && (
                    <>
                        <ResizeHandleContainer
                            style={{ left: 0 }}
                            onMouseDown={startResize}
                        >
                            <ResizeHandle className="resize-handle" />
                        </ResizeHandleContainer>
                        <ResizeHandleContainer
                            style={{ right: 0 }}
                            onMouseDown={startResize}
                        >
                            <ResizeHandle className="resize-handle" />
                        </ResizeHandleContainer>
                        <Controls className="controls">
                            <Button
                                icon={<FullWidthIcon size={16} />}
                                size="small"
                                onClick={() => {
                                    props.updateAttributes({
                                        width: "100%"
                                    })
                                }}
                            />
                            <Button
                                icon={<AlignLeftIcon size={16} />}
                                size="small"
                                onClick={() => {
                                    props.updateAttributes({
                                        align: "left"
                                    })
                                }}
                                active={node.attrs.align === "left"}
                            />
                            <Button
                                icon={<AlignCenterIcon size={16} />}
                                size="small"
                                onClick={() => {
                                    props.updateAttributes({
                                        align: "center"
                                    })
                                }}
                                active={node.attrs.align === "center"}
                            />
                            <Button
                                icon={<AlignRightIcon size={16} />}
                                size="small"
                                onClick={() => {
                                    props.updateAttributes({
                                        align: "right"
                                    })
                                }}
                                active={node.attrs.align === "right"}
                            />
                        </Controls>
                    </>
                )}
            </ImageContainer>
            {/* TODO : Caption */}
        </ImageNodeViewWrapper>
    )
}

const ImageNodeViewWrapper = styled(NodeViewWrapper)<{
    align: "left" | "center" | "right"
}>`
    display: flex;
    flex-direction: column;
    position: relative;
    left: ${({ align }) =>
        ({
            left: "0",
            center: "50%",
            right: "100%"
        }[align])};
    transform: translateX(
        ${({ align }) =>
            ({
                left: "0",
                center: "-50%",
                right: "-100%"
            }[align])}
    );
`

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 0.25rem;
    overflow: hidden;
    transition: width 0.15s ease-out, height 0.15s ease-out;

    & > img {
        width: 100%;
    }

    &:hover:not(.resizing) .controls {
        opacity: 0.8;
    }

    &:hover .resize-handle {
        opacity: 1;
    }
`

const ResizeHandleContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    z-index: 25;
    cursor: col-resize;
`

const ResizeHandle = styled.div`
    opacity: 0;
    transition: opacity 0.3s ease-in;
    width: 4px;
    height: 36px;
    max-height: 50%;
    box-sizing: content-box;
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 6px;
`

const Controls = styled.div`
    background-color: var(--color-black);
    position: absolute;
    left: 10px;
    top: 10px;
    opacity: 0;
    z-index: 25;
    transition: opacity 0.2s;
    display: flex;
    padding: 0.25rem;
    border-radius: 4px;
    gap: 0.25rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
`
