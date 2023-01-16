import { ReactElement, useState } from "react"
import styled from "styled-components"
import { Instance } from "tippy.js"

import Tippy from "@tippyjs/react"

import MenuItem from "./MenuItem"
import MenuSeparator from "./MenuSeparator"

interface MenuProps {
    children: ReactElement
    content: Function
    [key: string]: any
}

export default function Menu(props: MenuProps) {
    const { children, content, ...rest } = props
    const [instance, setInstance] = useState<Instance>(null)

    return (
        <StyledTippy
            arrow={false}
            trigger="click"
            interactive
            theme="light-border no-padding"
            animation="shift-away"
            content={content(instance)}
            onCreate={setInstance}
            appendTo="parent"
            followCursor={false}
            {...rest}
        >
            {children}
        </StyledTippy>
    )
}

Menu.Separator = MenuSeparator
Menu.Item = MenuItem

const StyledTippy = styled(Tippy)`
    font-size: 0.9em;
    border-radius: 8px;
`
