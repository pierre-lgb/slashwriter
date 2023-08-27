import {
    MouseEvent as ReactMouseEvent,
    useEffect,
    useRef,
    useState
} from "react"
import { AiOutlineColumnWidth as FullWidthIcon } from "react-icons/ai"
import {
    TbLayoutAlignCenter as AlignCenterIcon,
    TbLayoutAlignLeft as AlignLeftIcon,
    TbLayoutAlignRight as AlignRightIcon
} from "react-icons/tb"
import Button from "src/components/ui/Button"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import styles from "./ImageComponent.module.scss"

export default function ImageComponent(props: NodeViewProps) {
    const { node, editor } = props
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [resizing, setResizing] = useState<boolean>(false)
    const [resizeInitialWidth, setResizeInitialWidth] = useState<number>(0)
    const [resizeInitialMouseX, setResizeInitialMouseX] = useState<number>(0)

    function startResize(event: ReactMouseEvent<HTMLDivElement>) {
        event.preventDefault()

        setResizing(true)
        setResizeInitialMouseX(event.clientX)
        if (imageRef.current) {
            setResizeInitialWidth(imageRef.current.offsetWidth)
        }
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
        setResizeInitialMouseX(0)
        setResizeInitialWidth(0)
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
        <NodeViewWrapper
            className={`image ${
                props.selected ? "ProseMirror-selectednode" : ""
            } ${styles.imageComponent} ${styles[`${node.attrs.align}Align`]}`}
            style={{ width: node.attrs.width }}
        >
            <div
                className={`${styles.imageContainer} ${
                    resizing ? styles.resizing : ""
                }`}
            >
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    title={node.attrs.title}
                />

                {editor.isEditable && (
                    <>
                        <div
                            className={styles.resizeHandleContainer}
                            style={{ left: 0 }}
                            onMouseDown={startResize}
                        >
                            <div className={styles.resizeHandle} />
                        </div>
                        <div
                            className={styles.resizeHandleContainer}
                            style={{ right: 0 }}
                            onMouseDown={startResize}
                        >
                            <div className={styles.resizeHandle} />
                        </div>
                        <div className={styles.controls}>
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
                        </div>
                    </>
                )}
            </div>
            {/* TODO : Caption */}
        </NodeViewWrapper>
    )
}
