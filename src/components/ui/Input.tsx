import { InputHTMLAttributes, ReactNode, Ref, useState } from "react"
import {
    RiCheckLine as CheckedIcon,
    RiErrorWarningLine as ErrorIcon,
    RiFileCopyLine as CopyIcon
} from "react-icons/ri"
import Button from "src/components/ui/Button"
import FormLayout from "src/components/ui/FormLayout"

import styles from "./Input.module.scss"

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
        layout = "vertical",
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
            <div className={styles.inputContainer}>
                <input
                    className={`${styles.input} ${error ? styles.error : ""} ${
                        icon ? styles.withIcon : ""
                    } ${disabled ? styles.disabled : ""} ${
                        readOnly ? styles.readOnly : ""
                    } ${borderless ? styles.borderless : ""} ${styles[size]}`}
                    ref={inputRef}
                    type={type}
                    value={reveal && hidden ? "***** ***** *****" : value}
                    name={name}
                    id={id}
                    disabled={disabled || readOnly}
                    readOnly={readOnly}
                    {...otherProps}
                />
                {icon && (
                    <div className={styles.inputIconContainer}>{icon}</div>
                )}
                {(copy || error || actions) && (
                    <div className={styles.inputActionsContainer}>
                        {error && (
                            <ErrorIcon
                                color="var(--color-red)"
                                style={{ marginRight: 5 }}
                            />
                        )}
                        {actions}
                        {copy && !(reveal && hidden) && (
                            <Button
                                appearance="secondary"
                                icon={copied ? <CheckedIcon /> : <CopyIcon />}
                                onClick={() => onCopy(`${value}`)}
                            >
                                {copied ? "Copied !" : "Copy"}
                            </Button>
                        )}
                        {reveal && hidden && (
                            <Button
                                size="small"
                                appearance="secondary"
                                onClick={onReveal}
                            >
                                Reveal
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </FormLayout>
    )
}
