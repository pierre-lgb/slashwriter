import Link from "next/link"
import { ReactNode } from "react"
import Flex from "src/components/ui/Flex"
import Loader from "src/components/ui/Loader"

import styles from "./DocumentLink.module.scss"

export interface DocumentLinkProps {
    href?: string
    title: string
    status: string
    style?: any
    loading?: boolean
    actions?: ReactNode
    badge?: ReactNode
    [x: string]: any
}

export default function DocumentLink(props: DocumentLinkProps) {
    const {
        href = "",
        title,
        status,
        style,
        actions,
        badge,
        loading = false,
        ...otherProps
    } = props
    return (
        <Link href={href} {...otherProps}>
            <div className={styles.documentLink} style={style}>
                <div className={styles.documentIcon} />
                <Flex
                    auto
                    column
                    justify="center"
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            <span className={styles.documentTitle}>
                                {title}
                            </span>
                            <span className={styles.documentStatus}>
                                {status}
                            </span>
                        </>
                    )}
                </Flex>
                {badge && <span className={styles.badge}>{badge}</span>}
                <div className={styles.actions}>{actions}</div>
            </div>
        </Link>
    )
}
