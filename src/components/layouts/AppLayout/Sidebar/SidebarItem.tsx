import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MouseEventHandler, ReactNode } from "react"

import styles from "./SidebarItem.module.scss"

interface SidebarButtonProps {
    title: string
    icon: ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>
}

interface SidebarLinkProps {
    title: string
    icon: ReactNode
    active?: boolean
    href: string
}

export function SidebarButton(props: SidebarButtonProps) {
    return (
        <button className={styles.sidebarItem} onClick={props.onClick}>
            <div className={styles.iconContainer}>{props.icon}</div>
            <span className={styles.title}>{props.title}</span>
        </button>
    )
}

export function SidebarLink(props: SidebarLinkProps) {
    const pathname = usePathname()
    const isActive = props.active ?? pathname === props.href

    return (
        <Link href={props.href} passHref legacyBehavior>
            <a
                className={`${styles.sidebarItem} ${
                    isActive ? styles.active : ""
                }`}
            >
                <div className={styles.iconContainer}>{props.icon}</div>
                <span className={styles.title}>{props.title}</span>
            </a>
        </Link>
    )
}

const SidebarItem = {
    Link: SidebarLink,
    Button: SidebarButton
}

export default SidebarItem
