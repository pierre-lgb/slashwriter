import { InputHTMLAttributes, ReactNode, Ref, useState } from "react"
import Flex from "src/components/Flex"
import Button from "src/components/ui/Button"
import FormLayout from "src/components/ui/FormLayout"
import styled, { css } from "styled-components"

import Check from "@mui/icons-material/Check"
import ContentCopy from "@mui/icons-material/ContentCopy"
import ErrorOutline from "@mui/icons-material/ErrorOutline"

interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    copy?: boolean
    disabled?: boolean
    readOnly?: boolean
    error?: string
    icon?: ReactNode
    inputRef?: Ref<HTMLInputElement>
    label?: string
    description?: string
    layout?: "horizontal" | "vertical"
    reveal?: boolean
    actions?: ReactNode
    size?: "small" | "medium" | "large"
    borderless?: boolean
}

export default function Input(props: InputProps) {
    const {
        copy,
        error,
        icon,
        inputRef,
        label,
        description,
        layout,
        name,
        id,
        reveal = false,
        actions,
        size = "medium",
        readOnly = false,
        disabled = false,
        borderless = false,
        type = "text",
        value,
        className,
        style,
        ...otherProps
    } = props

    const [copied, setCopied] = useState(false)
    const [hidden, setHidden] = useState(true)

    function onCopy(value: string) {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 2500)
        })
    }

    function onReveal() {
        setHidden(false)
    }

    return (
        <FormLayout
            label={label}
            description={description}
            layout={layout}
            id={id}
            error={error}
            style={style}
            size={size}
            className={className}
        >
            <InputContainer>
                <InputComponent
                    ref={inputRef}
                    type={type}
                    value={reveal && hidden ? "***** ***** *****" : value}
                    name={name}
                    id={id}
                    error={!!error}
                    icon={!!icon}
                    disabled={disabled || readOnly}
                    readOnly={readOnly}
                    borderless={borderless}
                    inputSize={size}
                    {...otherProps}
                />
                {icon && <InputIconContainer>{icon}</InputIconContainer>}
                {(copy || error || actions) && (
                    <InputActionsContainer>
                        {actions}
                        {copy && !(reveal && hidden) && (
                            <Button
                                appearance="secondary"
                                icon={copied ? <Check /> : <ContentCopy />}
                                onClick={() => onCopy(`${value}`)}
                            >
                                {copied ? "Copié !" : "Copier"}
                            </Button>
                        )}
                        {reveal && hidden && (
                            <Button
                                size="small"
                                appearance="secondary"
                                onClick={onReveal}
                            >
                                Dévoiler
                            </Button>
                        )}
                        {error && <InputErrorIcon />}
                    </InputActionsContainer>
                )}
            </InputContainer>
        </FormLayout>
    )
}

const InputContainer = styled.div`
    position: relative;
`
const InputComponent = styled.input<{
    error: boolean
    icon: boolean
    disabled: boolean
    readOnly: boolean
    borderless: boolean
    inputSize: "small" | "medium" | "large"
}>`
    display: block;
    padding: ${({ inputSize }) =>
        ({
            small: "0.4rem 0.6rem",
            medium: "0.5rem 0.8rem",
            large: "0.6rem 1rem"
        }[inputSize])};
    font-size: ${({ inputSize }) =>
        ({
            small: "0.8rem",
            medium: "0.9rem",
            large: "1rem"
        }[inputSize])};

    width: 100%;
    border-style: solid;
    border-width: 1px;
    border-color: var(--color-n400);
    border-radius: 4px;
    transition: all ease-out 0.2s;
    background-color: var(--color-white);
    color: var(--color-n800);
    outline: none;

    ${({ error }) =>
        error &&
        css`
            border-color: var(--color-red);
        `}

    ${({ icon }) =>
        icon &&
        css`
            padding-left: 2.25rem;
        `}

    ${({ disabled, readOnly }) =>
        (disabled || readOnly) &&
        (readOnly
            ? css`
                  color: var(--color-n600);
              `
            : css`
                  opacity: 0.5;
                  cursor: not-allowed;
              `)}

    ${({ borderless }) =>
        borderless &&
        css`
            border-color: transparent;
            box-shadow: none;
        `}

    &:focus {
        box-shadow: 0 0 0 2px rgba(150, 150, 150, 0.1);
    }
`

const InputIconContainer = styled.div`
    position: absolute;
    inset: 0 auto 0 0;
    padding-left: 0.75rem;
    display: flex;
    align-items: center;
    pointer-events: none;

    svg {
        color: var(--color-n600);
        font-size: 1.1rem;
    }
`

const InputActionsContainer = styled(Flex)`
    position: absolute;
    inset: 0 0 0 auto;
    align-items: center;
    gap: 0.2rem;
`

const InputErrorIcon = styled(ErrorOutline)`
    color: var(--color-red);
    font-size: 1.1rem;
    margin-right: 0.5rem;
`
