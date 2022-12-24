import { InputHTMLAttributes, ReactNode } from "react"
import { MdCheck as CheckedIcon, MdOutlineExpandMore as ExpandIcon } from "react-icons/md"
import styled from "styled-components"

import * as SelectPrimitive from "@radix-ui/react-select"

import FormLayout from "./FormLayout"

interface OptionProps {
    value?: string
    children?: ReactNode
    selected?: boolean
}

function Option(props: OptionProps) {
    const { value, children } = props
    return (
        <SelectItem value={value}>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectItemIndicator>
                <CheckedIcon fontSize="1rem" />
            </SelectItemIndicator>
        </SelectItem>
    )
}

const SelectItem = styled(SelectPrimitive.Item)`
    all: unset;
    font-size: 0.9rem;
    cursor: pointer;
    color: var(--color-n800);
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 0.5rem 2rem;
    position: relative;
    user-select: none;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-n200);
    }

    &[data-disabled] {
        color: var(--color-n600);
        pointer-events: none;
    }

    &[data-highlighted] {
        background-color: var(--color-n100);
    }
`
const SelectItemIndicator = styled(SelectPrimitive.ItemIndicator)`
    position: absolute;
    left: 0;
    width: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`

interface SelectProps
    extends Omit<InputHTMLAttributes<HTMLSelectElement>, "size"> {
    children?: ReactNode
    value?: string
    disabled?: boolean
    error?: string
    label?: string
    description?: string
    layout?: "horizontal" | "vertical"
    borderless?: boolean
    size?: "small" | "medium" | "large"
    onValueChange?: any
}

export default function Select(props: SelectProps) {
    const {
        children,
        value,
        disabled,
        error,
        id,
        name,
        style,
        className,
        label,
        description,
        layout,
        borderless,
        size = "medium",
        onValueChange
    } = props

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
            <SelectPrimitive.Root
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                name={name}
            >
                <SelectTrigger size={size} borderless={borderless}>
                    <SelectPrimitive.Value aria-label={value} />
                    <SelectPrimitive.SelectIcon>
                        <ExpandIcon color="var(--color-n700)" fontSize="1rem" />
                    </SelectPrimitive.SelectIcon>
                </SelectTrigger>
                <SelectPrimitive.Portal>
                    <SelectContent borderless={borderless}>
                        <SelectPrimitive.Viewport style={{ padding: 5 }}>
                            {children}
                        </SelectPrimitive.Viewport>
                    </SelectContent>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
        </FormLayout>
    )
}

Select.Option = Option

const SelectTrigger = styled(SelectPrimitive.SelectTrigger)<{
    size: "small" | "medium" | "large"
    borderless: boolean
}>`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    border-radius: 4px;
    padding: ${({ size }) =>
        ({
            small: "0.4rem 0.6rem",
            medium: "0.5rem 0.8rem",
            large: "0.6rem 1rem"
        }[size])};

    font-size: 0.9rem;
    background-color: var(--color-white);
    border: ${({ borderless }) =>
        borderless ? "1px solid transparent" : "1px solid var(--color-n400)"};
    color: var(--color-n800);
    cursor: pointer;
    outline: none;

    &:focus {
        box-shadow: 0 0 0 2px rgba(150, 150, 150, 0.1);
    }

    &[data-disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

const SelectContent = styled(SelectPrimitive.Content)<{
    borderless: boolean
}>`
    overflow: hidden;
    background-color: var(--color-white);
    border: ${({ borderless }) =>
        borderless ? "1px solid transparent" : "1px solid var(--color-n400)"};
    border-radius: 4px;
    box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
        0px 10px 20px -15px rgba(22, 23, 24, 0.2);
    z-index: 100;
`
