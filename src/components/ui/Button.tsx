import { forwardRef, MouseEventHandler, ReactElement } from "react"
import styled, { css } from "styled-components"

interface ButtonProps {
    color?: string
    border?: boolean
    text?: string
    icon?: ReactElement
    [key: string]: any
}

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    props,
    ref
) {
    return (
        <StyledButton {...props} ref={ref} onClick={props.onClick}>
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
        color === "primary" ? "var(--color-black)" : "none"};
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
    transition: background-color ease-out 50ms, box-shadow ease-out 200ms;
    outline: none;
    cursor: pointer;

    & > svg {
        color: ${({ color }) =>
            color === "primary" ? "var(--color-white)" : "var(--color-n600)"};
    }

    &:hover {
        background: ${({ color }) =>
            color === "primary" ? "var(--color-n800)" : "var(--color-n100)"};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px var(--color-n200);
        border-color: transparent;
    }
`
