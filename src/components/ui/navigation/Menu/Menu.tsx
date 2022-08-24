import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { Instance } from 'tippy.js'

import Tippy from '@tippyjs/react'

import MenuDivider from './MenuDivider'
import MenuItem from './MenuItem'

interface MenuProps {
    children: ReactElement
    content: (instance: Instance) => ReactElement
    [x: string]: any
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

Menu.Divider = MenuDivider
Menu.Item = MenuItem

const StyledTippy = styled(Tippy)`
    border-radius: 5px;

    & > div {
        padding: 6px;
    }
`
