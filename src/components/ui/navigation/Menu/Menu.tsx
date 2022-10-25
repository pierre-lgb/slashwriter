import { ReactElement, useState } from "react"
import styled from "styled-components"
import { Instance } from "tippy.js"

import Tippy from "@tippyjs/react"

import MenuItem from "./MenuItem"
import MenuSeparator from "./MenuSeparator"

interface MenuProps {
    children: ReactElement
    content: (instance: Instance) => ReactElement
    [key: string]: any
}

export default function Menu({ children, content, ...rest }: MenuProps) {
    const [instance, setInstance] = useState<Instance>(null)

    return (
        <StyledTippy
            arrow={false}
            trigger="click"
            interactive
            theme="light-border"
            animation="shift-away"
            content={content(instance)}
            onCreate={setInstance}
            {...rest}
        >
            {children}
        </StyledTippy>
    )
}

Menu.Separator = MenuSeparator
Menu.Item = MenuItem

const StyledTippy = styled(Tippy)`
    border-radius: 5px;
    font-size: 0.9em;

    & > div {
        padding: 6px;
    }
`
