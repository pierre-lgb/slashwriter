import { InputHTMLAttributes, ReactNode } from "react"
import {
    RiArrowDownSLine as ExpandIcon,
    RiCheckLine as CheckedIcon
} from "react-icons/ri"

import * as SelectPrimitive from "@radix-ui/react-select"

import FormLayout from "./FormLayout"
import styles from "./Select.module.scss"

interface OptionProps {
    value?: string
    children?: ReactNode
    selected?: boolean
}

function Option(props: OptionProps) {
    const { value = "", children } = props

    return (
        <SelectPrimitive.Item className={styles.selectItem} value={value}>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator
                className={styles.selectItemIndicator}
            >
                <CheckedIcon fontSize="1rem" />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    )
}

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
                <SelectPrimitive.SelectTrigger
                    className={`${styles.selectTrigger} ${styles[size]} ${
                        borderless ? styles.borderless : ""
                    }`}
                >
                    <SelectPrimitive.Value aria-label={value} />
                    <SelectPrimitive.SelectIcon>
                        <ExpandIcon color="var(--color-n700)" fontSize="1rem" />
                    </SelectPrimitive.SelectIcon>
                </SelectPrimitive.SelectTrigger>
                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        className={`${styles.selectContent} ${
                            borderless ? styles.borderless : ""
                        }`}
                    >
                        <SelectPrimitive.Viewport style={{ padding: 5 }}>
                            {children}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
        </FormLayout>
    )
}

Select.Option = Option
