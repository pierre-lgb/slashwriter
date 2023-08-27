import { forwardRef, MouseEventHandler, ReactNode } from "react"

import styles from "./Button.module.scss"
import Loader from "./Loader"

interface ButtonProps {
    children?: ReactNode
    className?: string
    disabled?: boolean
    loading?: boolean
    onClick?: MouseEventHandler<HTMLButtonElement>
    icon?: ReactNode
    iconRight?: ReactNode
    appearance?: "primary" | "secondary" | "text"
    size?: "small" | "medium" | "large"
    block?: boolean
    danger?: boolean
    active?: boolean
    ariaSelected?: boolean
    ariaControls?: boolean
    tabIndex?: number
    title?: string
    [x: string]: any
}

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    props: ButtonProps,
    ref
) {
    const {
        children,
        className,
        disabled = false,
        loading = false,
        onClick,
        icon,
        iconRight,
        appearance = "primary",
        size = "medium",
        block = false,
        danger,
        active,
        ariaSelected,
        ariaControls,
        tabIndex,
        ...otherProps
    } = props

    return (
        <button
            ref={ref}
            onClick={onClick}
            disabled={!!loading || !!disabled}
            aria-selected={`${ariaSelected ?? ""}` || undefined}
            aria-controls={`${ariaControls ?? ""}` || undefined}
            tabIndex={tabIndex}
            className={`${styles.button} ${disabled ? styles.disabled : ""} ${
                styles[appearance]
            } ${styles[size]} ${block ? styles.block : ""} ${
                danger ? styles.danger : ""
            } ${active ? styles.active : ""} ${
                icon && !children ? styles.iconOnly : ""
            } ${className}`}
            {...otherProps}
        >
            {loading ? (
                <Loader />
            ) : !!icon ? (
                <div className={`${styles.iconContainer} ${styles[size]}`}>
                    {icon}
                </div>
            ) : null}
            {children && <span>{children}</span>}
            {!!iconRight && !loading && (
                <div className={`${styles.iconContainer} ${styles[size]}`}>
                    {iconRight}
                </div>
            )}
        </button>
    )
})
