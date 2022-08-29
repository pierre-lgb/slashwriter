import { forwardRef, MouseEventHandler, ReactElement } from 'react'
import styled, { css } from 'styled-components'

interface ButtonProps {
    color?: string
    border?: boolean
    text?: string
    icon?: ReactElement
    [x: string]: any
}

export default forwardRef(function Button(props: ButtonProps, ref) {
    return (
        <StyledButton
            {...props}
            ref={ref}
            onClick={(e) => {
                e.preventDefault()
                props.onClick(e)
            }}
        >
            {props.icon}
            {props.text}
        </StyledButton>
    )
})

const StyledButton = styled.button<ButtonProps>`
    display: flex;
    align-items: center;
    padding: ${({ text }) => (text ? "8px 16px" : "8px")};
    gap: 5px;
    flex-grow: 0;
    background: ${({ color }) =>
        color === "primary" ? "var(--color-b400)" : "none"};
    color: ${({ color }) =>
        color === "primary" ? "var(--color-white)" : "var(--color-n700)"};
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
        background: ${({ color }) =>
            color === "primary" ? "var(--color-b500)" : "var(--color-n100)"};
        cursor: pointer;
    }
`
