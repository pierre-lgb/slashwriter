import 'tippy.js/themes/light-border.css'
import 'tippy.js/animations/shift-away.css'

import { useState } from 'react'

import Tippy from '@tippyjs/react'

import styles from './Menu.module.css'

export function Menu({ children, content, ...props }) {
    const [instance, setInstance] = useState(null)

    return (
        <Tippy
            theme="light-border"
            className={styles.tippyBox}
            arrow={false}
            trigger="click"
            interactive
            animation="shift-away"
            content={content(instance)}
            onCreate={setInstance}
            {...props}
        >
            {children}
        </Tippy>
    )
}

export { default as MenuDivider } from "./MenuDivider"
export { default as MenuItem } from "./MenuItem"
export { default as MenuItemToggle } from "./MenuItemToggle"
