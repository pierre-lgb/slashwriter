import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import Emoji from "../Emoji"
import styles from "./EmojiList.module.scss"

function formatItemsAsRows(items, itemsPerRow) {
    const rows: any[] = []
    for (let i = 0; i < items.length; i += itemsPerRow) {
        let colIndex = 0

        const row = items.slice(i, i + itemsPerRow).map((item) => ({
            ...item,
            index: i + colIndex++
        }))

        rows.push(row)
    }

    return rows
}

const ITEMS_PER_ROW = 8

export default forwardRef(function EmojiList(props: any, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index) => {
        const item = props.items[index]

        if (item) {
            props.command({ emoji: item.unicode })
        }
    }

    const leftHandler = () => {
        setSelectedIndex(
            (selectedIndex - 1 + props.items.length) % props.items.length
        )
    }

    const rightHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const upHandler = () => {
        setSelectedIndex(
            (selectedIndex - ITEMS_PER_ROW + props.items.length) %
                props.items.length
        )
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + ITEMS_PER_ROW) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props.items])

    useImperativeHandle(
        ref,
        () => {
            return {
                onKeyDown: (x) => {
                    if (x.event.key === "ArrowLeft") {
                        leftHandler()
                        return true
                    }

                    if (x.event.key === "ArrowRight") {
                        rightHandler()
                        return true
                    }

                    if (x.event.key === "ArrowUp") {
                        upHandler()
                        return true
                    }

                    if (x.event.key === "ArrowDown") {
                        downHandler()
                        return true
                    }

                    if (x.event.key === "Enter") {
                        enterHandler()
                        return true
                    }

                    return false
                }
            }
        },
        [leftHandler, rightHandler, enterHandler]
    )

    return (
        <div className={styles.emojiList}>
            {props.items.length ? (
                formatItemsAsRows(props.items, ITEMS_PER_ROW).map(
                    (row, index) => (
                        <div className={styles.row} key={index}>
                            {row.map((item) => (
                                <button
                                    className={`${styles.emojiButton} ${
                                        item.index === selectedIndex
                                            ? styles.selected
                                            : ""
                                    }`}
                                    title={`:${item.shortcode}:`}
                                    key={item.index}
                                    onClick={() => selectItem(item.index)}
                                >
                                    <Emoji
                                        className={styles.emoji}
                                        emoji={item.unicode}
                                    />
                                </button>
                            ))}
                        </div>
                    )
                )
            ) : (
                <div className={styles.row}>
                    <Emoji
                        className={styles.emoji}
                        emoji="😕"
                        style={{ display: "flex", padding: "0.25rem" }}
                    />{" "}
                    No emoji found
                </div>
            )}
        </div>
    )
})
