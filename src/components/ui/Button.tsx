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
                props.onClick?.(e)
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
    gap: 8px;
    flex-grow: 0;
    background: ${({ color }) =>
        color === "primary" ? "var(--color-b400)" : "none"};
    color: ${({ color }) =>
        color === "primary" ? "var(--color-white)" : "var(--color-n700)"};
    border: none;
    ${({ border }) =>
        border &&
        css`
            border: 1px solid var(--color-n300);
        `}
    border-radius: 4px;
    outline: none;
    font-size: 0.9em;
    transition: background ease-out 100ms, box-shadow ease-out 200ms;
    outline: none;

    & > svg {
        color: ${({ color }) =>
            color === "primary" ? "var(--color-white)" : "var(--color-n600)"};
    }

    &:hover {
        background: ${({ color }) =>
            color === "primary" ? "var(--color-b500)" : "var(--color-n100)"};
        cursor: pointer;
    }

    &:focus {
        box-shadow: 0 0 0 2px var(--color-b200);
        border-color: transparent;
    }
`
