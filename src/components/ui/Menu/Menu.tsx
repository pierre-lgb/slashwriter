import { ReactElement, useState } from "react"
import { Instance } from "tippy.js"

import Tippy from "@tippyjs/react"

import styles from "./Menu.module.scss"
import MenuItem from "./MenuItem"
import MenuSeparator from "./MenuSeparator"

interface MenuProps {
    children: ReactElement
    content: Function
    [key: string]: any
}

export default function Menu(props: MenuProps) {
    const { children, content, ...rest } = props
    const [instance, setInstance] = useState<Instance>()

    return (
        <Tippy
            arrow={false}
            trigger="click"
            interactive
            theme="light-border no-padding"
            animation="shift-away"
            content={content(instance)}
            onCreate={setInstance}
            appendTo="parent"
            className={styles.menu}
            {...rest}
        >
            {children}
        </Tippy>
    )
}

Menu.Separator = MenuSeparator
Menu.Item = MenuItem
