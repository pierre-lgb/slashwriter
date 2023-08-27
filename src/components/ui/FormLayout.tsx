import { CSSProperties, ReactNode } from "react"

import styles from "./FormLayout.module.scss"

interface FormLayoutProps {
    children?: ReactNode
    className?: string
    align?: string
    error?: string
    label?: string
    description?: string
    layout?: "horizontal" | "vertical"
    style?: CSSProperties
    flex?: boolean
    size?: "small" | "medium" | "large"
    id?: string
}

export default function FormLayout(props: FormLayoutProps) {
    const {
        children,
        className = "",
        align,
        error = "",
        label,
        description,
        layout = "vertical",
        style,
        flex = false,
        size,
        id
    } = props

    return (
        <div
            className={`${className} ${styles.formLayout} ${
                ["right", "left"].includes(align || "")
                    ? styles[`${align}Align`]
                    : ""
            } ${flex ? styles.flex : ""} ${
                layout === "horizontal" ? styles.horizontalLayout : ""
            } ${size ? styles[size] : ""}`}
        >
            {!!label || layout === "horizontal" ? (
                <div
                    className={`${styles.labelContainer} ${
                        styles[`${layout}Layout`]
                    }`}
                >
                    {!!label && (
                        <label className={styles.label} htmlFor={id}>
                            {label}
                        </label>
                    )}
                </div>
            ) : null}
            <div
                className={`${styles.contentContainer} ${
                    styles[`${layout}Layout`]
                }`}
                style={{
                    ...(align === "right" ? { textAlign: "right" } : {}),
                    ...style
                }}
            >
                {children}
                {error && <p className={styles.errorMessage}>{error}</p>}
                {description && (
                    <p className={styles.description}>{description}</p>
                )}
            </div>
        </div>
    )
}
