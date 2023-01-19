import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import Emoji from "src/components/Emoji"
import styled from "styled-components"

function formatItemsAsRows(items, itemsPerRow) {
    const rows = []
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
        <Container>
            {props.items.length ? (
                formatItemsAsRows(props.items, ITEMS_PER_ROW).map(
                    (row, index) => (
                        <Row key={index}>
                            {row.map((item) => (
                                <EmojiButton
                                    className={
                                        item.index === selectedIndex
                                            ? "is-selected"
                                            : ""
                                    }
                                    title={`:${item.shortcode}:`}
                                    key={item.index}
                                    onClick={() => selectItem(item.index)}
                                >
                                    <Emoji emoji={item.unicode} />
                                </EmojiButton>
                            ))}
                        </Row>
                    )
                )
            ) : (
                <Row>
                    <Emoji
                        emoji="😕"
                        style={{ display: "flex", padding: "0.25rem" }}
                    />{" "}
                    Aucun résultat
                </Row>
            )}
        </Container>
    )
})

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    position: relative;
    border-radius: 4px;
    background: #fff;
    color: rgba(0, 0, 0, 0.8);
    overflow: hidden;
    font-size: 0.9rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);

    img.emoji {
        width: 1.5em;
        height: 1.5em;
    }
`

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
`

const EmojiButton = styled.button`
    display: block;
    margin: 0;
    text-align: left;
    background: transparent;
    border-radius: 0.4rem;
    border: 1px solid transparent;
    padding: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &.is-selected {
        background-color: var(--color-n100);
    }

    & > span {
        display: flex;
    }

    &:hover {
        background-color: var(--color-n100);
    }
`
