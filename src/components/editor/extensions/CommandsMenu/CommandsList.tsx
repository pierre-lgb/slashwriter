import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styled, { css } from 'styled-components'

export default forwardRef(function CommandsList(props: any, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        setSelectedIndex(0)
    }, [props.items])

    const selectItem = (index) => {
        const item = props.items[index]

        if (item) {
            props.command(item)
        }
    }

    const upHandler = () => {
        setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
        )
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useImperativeHandle(ref, () => {
        return {
            onKeyDown: ({ event }) => {
                switch (event.key) {
                    case "ArrowUp":
                        upHandler()
                        return true
                    case "ArrowDown":
                        downHandler()
                        return true
                    case "Enter":
                        enterHandler()
                        return true
                    default:
                        return false
                }
            }
        }
    })

    return (
        <div className="items">
            {props.items.length ? (
                props.items.map((item, index) => (
                    <Item
                        key={index}
                        onClick={() => selectItem(index)}
                        selected={selectedIndex === index}
                    >
                        {item.title}
                    </Item>
                ))
            ) : (
                <div className="item">Aucun résultat</div>
            )}
        </div>
    )
})

const Item = styled.button<{ selected?: boolean }>`
    display: block;
    margin: 0;
    width: 100%;
    text-align: left;
    background: transparent;
    border-radius: 0.4rem;
    border: 1px solid transparent;
    padding: 0.2rem 0.4rem;

    ${({ selected }) =>
        selected &&
        css`
            background-color: var(--color-n100);
        `}
`
