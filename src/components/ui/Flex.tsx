import { CSSProperties, ReactNode } from "react"

import styles from "./Flex.module.scss"

interface FlexProps {
    children?: ReactNode
    className?: string
    style?: CSSProperties
    auto?: boolean
    column?: boolean
    reverse?: boolean
    shrink?: boolean
    align?: CSSProperties["alignItems"]
    justify?: CSSProperties["justifyContent"]
    gap?: number
    inline?: boolean
}

export default function Flex(props: FlexProps) {
    const {
        children,
        className = "",
        style,
        auto = false,
        column = false,
        reverse = false,
        shrink = false,
        align,
        justify,
        gap,
        inline = false
    } = props

    return (
        <div
            className={`${styles.flex} ${inline ? styles.inline : ""} ${
                auto ? styles.auto : ""
            } ${column ? styles.column : ""} ${reverse ? styles.reverse : ""} ${
                shrink ? styles.shrink : ""
            } ${className}`}
            style={{
                alignItems: align,
                justifyContent: justify,
                gap,
                ...style
            }}
        >
            {children}
        </div>
    )
}
