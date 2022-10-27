import { forwardRef, MouseEventHandler, ReactNode } from "react"
import styled, { css } from "styled-components"

import Loader from "./Loader"

interface ButtonProps {
    children?: ReactNode
    disabled?: boolean
    loading?: boolean
    loadingCentered?: boolean
    onClick?: MouseEventHandler<HTMLButtonElement>
    icon?: ReactNode
    iconRight?: ReactNode
    appearance?: "primary" | "secondary" | "text"
    size?: "small" | "medium" | "large"
    block?: boolean
    danger?: boolean
    textAlign?: "left" | "center" | "right"
    ariaSelected?: boolean
    ariaControls?: boolean
    tabIndex?: number
}

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    props,
    ref
) {
    const {
        children,
        disabled = false,
        loading = false,
        loadingCentered = false,
        onClick,
        icon,
        iconRight,
        appearance = "primary",
        size = "medium",
        block = false,
        danger,
        textAlign = "center",
        ariaSelected,
        ariaControls,
        tabIndex,
        ...otherProps
    } = props

    return (
        <ButtonComponent
            ref={ref}
            onClick={onClick}
            disabled={!!loading || !!disabled}
            aria-selected={`${ariaSelected ?? ""}` || undefined}
            aria-controls={`${ariaControls ?? ""}` || undefined}
            tabIndex={tabIndex}
            block={block}
            size={size}
            appearance={appearance}
            iconOnly={!children && !iconRight}
            danger={danger}
            {...otherProps}
        >
            {loading ? (
                <Loader />
            ) : !!icon ? (
                <IconContainer size={size}>{icon}</IconContainer>
            ) : null}
            {children && <span>{children}</span>}
            {!!iconRight && !loading && (
                <IconContainer size={size}>{iconRight}</IconContainer>
            )}
        </ButtonComponent>
    )
})

const ButtonComponent = styled.button<{
    block: boolean
    disabled: boolean
    size: "small" | "medium" | "large"
    appearance: "primary" | "secondary" | "text"
    danger: boolean
    iconOnly: boolean
}>`
    font-family: inherit;
    font-weight: inherit;
    font-size: ${({ size }) =>
        ({ small: "0.8rem", medium: "0.9rem", large: "1rem" }[size])};
    padding: ${({ size, iconOnly }) =>
        iconOnly
            ? {
                  small: "0.4rem",
                  medium: "0.5rem",
                  large: "0.6rem"
              }[size]
            : {
                  small: "0.4rem 0.6rem",
                  medium: "0.5rem 1rem",
                  large: "0.6rem 1.4rem"
              }[size]};
    color: ${({ appearance }) =>
        appearance === "primary" ? "var(--color-white)" : "var(--color-n800)"};
    background: ${({ appearance }) =>
        appearance === "primary" ? "var(--color-black)" : "none"};
    border: ${({ appearance }) =>
        appearance === "secondary"
            ? "1px solid var(--color-n400)"
            : "1px solid transparent"};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    border-radius: 4px;
    outline: none;
    transition: all ease-out 0.2s;

    ${({ block }) =>
        block &&
        css`
            display: flex;
            justify-content: center;
            width: 100%;
        `}

    ${({ disabled }) =>
        disabled &&
        css`
            opacity: 0.75;
            cursor: not-allowed;
        `}

    ${({ danger, appearance }) =>
        danger &&
        css`
            color: ${appearance === "primary"
                ? "var(--color-white)"
                : "var(--color-red)"};
            background: ${appearance === "primary"
                ? "var(--color-red)"
                : "none"};
            border: ${appearance === "secondary"
                ? "1px solid var(--color-red)"
                : "1px solid transparent"};
        `}

    &:hover {
        background: ${({ appearance }) =>
            appearance === "primary"
                ? "var(--color-n800)"
                : "var(--color-n200)"};

        ${({ danger, appearance }) =>
            danger &&
            css`
                background: ${appearance === "primary"
                    ? "var(--color-r500)"
                    : "var(--color-r50)"};
            `}
    }
`

const IconContainer = styled.div<{ size: "small" | "medium" | "large" }>`
    height: 100%;
    display: inline-flex;
    align-items: center;

    & > svg {
        /* height: unset;
        width: unset; */
        font-size: ${({ size }) =>
            ({
                small: "0.8rem",
                medium: "1rem",
                large: "1.2rem"
            }[size])};
    }
`
