import { MouseEventHandler, ReactNode } from "react"
import Flex from "src/components/Flex"
import styled, { css } from "styled-components"
import { Instance as TippyInstance } from "tippy.js"

interface MenuItemProps {
    title: string
    icon: ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>
    menu: TippyInstance
}

export default function MenuItem(props: MenuItemProps) {
    return (
        <Wrapper
            gap={10}
            align="center"
            onClick={(e) => {
                props.menu.hide()
                props.onClick(e)
            }}
            as="button"
        >
            <IconContainer>{props.icon}</IconContainer>
            <Title>{props.title}</Title>
        </Wrapper>
    )
}

const Wrapper = styled(Flex)<{ active?: boolean }>`
    border-radius: 4px;
    padding: 2px;
    color: var(--color-n700);
    border: none;
    font-size: 1em;
    background: none;
    transition: background-color ease-out 50ms;

    ${(props) =>
        props.active &&
        css`
            background: var(--color-b100);
            color: var(--color-b400);
        `}

    &:hover {
        cursor: pointer;
        ${({ active }) =>
            !active &&
            css`
                background-color: var(--color-n100);
            `}
    }
`

const Title = styled(Flex)`
    font-size: 0.95em;
`

const IconContainer = styled(Flex)`
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;

    & > svg {
        font-size: 1.25em;
    }
`
