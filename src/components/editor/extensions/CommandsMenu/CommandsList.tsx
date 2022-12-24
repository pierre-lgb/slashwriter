import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import Flex from "src/components/Flex"
import Typography from "src/components/ui/Typography"
import styled, { css } from "styled-components"

export default forwardRef(function CommandsList(props: any, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const menuRef = useRef<HTMLDivElement>()

    useEffect(() => {
        setSelectedIndex(0)
    }, [props.items])

    useEffect(() => {
        const selectedItem = menuRef.current.querySelector(
            'button[data-selected="true"]'
        )

        if (selectedIndex === 0) {
            menuRef.current.scrollTo({ top: 0, behavior: "smooth" })
        } else if (selectedItem) {
            const itemRect = selectedItem.getBoundingClientRect()
            const menuRect = menuRef.current.getBoundingClientRect()

            if (itemRect.bottom > menuRect.bottom) {
                menuRef.current.scrollTo({
                    top:
                        itemRect.bottom -
                        menuRect.bottom +
                        menuRef.current.scrollTop,
                    behavior: "smooth"
                })
            } else if (itemRect.top < menuRect.top) {
                menuRef.current.scrollTo({
                    top:
                        itemRect.top - menuRect.top + menuRef.current.scrollTop,
                    behavior: "smooth"
                })
            }
        }
    }, [selectedIndex])

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
        <MenuContent ref={menuRef}>
            {props.items.length ? (
                Object.entries(
                    props.items.reduce((acc, curr) => {
                        const { category } = curr
                        acc[category] = acc[category] ?? []
                        acc[category].push(curr)

                        return acc
                    }, {})
                ).map(([category, content]: [string, any[]], index) => (
                    <Category key={index}>
                        <CategoryName>
                            <div>{category}</div>
                        </CategoryName>
                        {content.map((item) => (
                            <Item
                                key={item.index}
                                onClick={() => selectItem(item.index)}
                                selected={selectedIndex === item.index}
                                data-selected={selectedIndex === item.index}
                            >
                                <ItemIconContainer>
                                    {item.icon}
                                </ItemIconContainer>
                                <Flex column gap={3}>
                                    <ItemName>{item.name}</ItemName>
                                    <ItemDescription>
                                        {item.description}
                                    </ItemDescription>
                                </Flex>
                            </Item>
                        ))}
                    </Category>
                ))
            ) : (
                <NoResult>Aucun résultat</NoResult>
            )}
        </MenuContent>
    )
})

const MenuContent = styled.div`
    width: 300px;
    max-width: 100%;
    max-height: 350px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.5rem 0;
`

const Category = styled.div`
    &:not(:first-child) {
        margin-top: 0.5rem;
    }
`

const CategoryName = styled.div`
    text-transform: uppercase;
    padding: 0.4rem 1rem;
    color: var(--color-n600);
    font-size: 0.8rem;

    & > div {
        align-self: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const Item = styled.button<{
    selected?: boolean
}>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

const ItemIconContainer = styled.div`
    background-color: #ffffff;
    padding: 0.6rem;
    border-radius: 4px;
    border: 1px solid var(--color-n300);
    display: inline-flex;
    align-items: center;
    justify-content: center;
`

const ItemName = styled.div`
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-n900);
`

const ItemDescription = styled.div`
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-n600);
`

const NoResult = styled.span`
    color: var(--color-red);
    font-size: 1rem;
    padding: 0.4rem 1rem;
`
