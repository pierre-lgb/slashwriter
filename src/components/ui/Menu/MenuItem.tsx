import { MouseEventHandler, ReactNode } from "react"
import { Instance as TippyInstance } from "tippy.js"

import styles from "./MenuItem.module.scss"

interface MenuItemProps {
    title: string
    icon: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
    menu: TippyInstance
    active?: boolean
    [x: string]: any
}

export default function MenuItem(props: MenuItemProps) {
    const {
        menu,
        onClick = () => {},
        icon,
        title,
        active = false,
        ...otherProps
    } = props

    return (
        <button
            className={`${styles.menuItem} ${active ? styles.active : ""}`}
            onClick={(e) => {
                props.menu.hide()
                onClick(e)
            }}
            {...otherProps}
        >
            <div className={styles.iconContainer}>{props.icon}</div>
            <span className={styles.title}>{props.title}</span>
        </button>
    )
}
