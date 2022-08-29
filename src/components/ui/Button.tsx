import { MouseEventHandler, ReactElement } from 'react'
import styled, { css } from 'styled-components'

interface ButtonProps {
    primary?: boolean
    border?: boolean
    text?: string
    icon?: ReactElement
    onClick: MouseEventHandler<HTMLButtonElement>
}

export default function Button(props: ButtonProps) {
    return (
        <StyledButton
            {...props}
            onClick={(e) => {
                e.preventDefault()
                props.onClick(e)
            }}
        >
            {props.icon}
            {props.text}
        </StyledButton>
    )
}

const StyledButton = styled.button<ButtonProps>`
    display: flex;
    align-items: center;
    padding: ${({ text }) => (text ? "8px 16px" : "8px")};
    flex-grow: 0;
    background: ${({ primary }) => (primary ? "var(--color-b400)" : "none")};
    color: ${({ primary }) =>
        primary ? "var(--color-white)" : "var(--color-n700)"};
    ${({ border }) =>
        border &&
        css`
            box-shadow: 0 0 0px 1px var(--color-n300) inset;
        `}
    border-radius: 4px;
    border: none;
    outline: none;
    font-size: 0.9em;
    transition: background 100ms ease-out;

    &:hover {
        background: ${({ primary }) =>
            primary ? "var(--color-b500)" : "var(--color-n100)"};
        cursor: pointer;
    }
`
