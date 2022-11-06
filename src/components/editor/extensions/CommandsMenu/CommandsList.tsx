import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import styled, { css } from "styled-components"

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
        <MenuContent>
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
                <NoResult>Aucun résultat</NoResult>
            )}
        </MenuContent>
    )
})

const MenuContent = styled.div`
    width: 275px;
    max-width: 100%;
    max-height: 350px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.5rem 0;
`

const Item = styled.button<{ selected?: boolean }>`
    display: block;
    position: relative;
    margin: 0;
    width: 100%;
    text-align: left;
    color: var(--color-n800);
    outline: none;
    border-radius: 0 4px 0 4px;
    border: none;
    padding: 0.4rem 1rem;
    background: none;
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;

    &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        border-radius: 0px 2px 2px 0px;
        background-color: var(--color-black);
        transition: 0.25s;
        transform: scaleX(0);
        transform-origin: left center;
    }

    ${({ selected }) =>
        selected &&
        css`
            background-color: var(--color-n100);

            &:before {
                transform: scaleX(1);
            }
        `}
    &:hover {
        background-color: var(--color-n100);
    }
`

const NoResult = styled.span`
    color: var(--color-red);
    font-size: 1rem;
    padding: 0.4rem 1rem;
`
