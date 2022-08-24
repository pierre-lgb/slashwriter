import { CSSProperties } from 'react'
import styled from 'styled-components'

interface FlexProps {
    auto?: boolean
    column?: boolean
    reverse?: boolean
    shrink?: boolean
    align?: CSSProperties["alignItems"]
    justify?: CSSProperties["justifyContent"]
    gap?: number
}

const Flex = styled.div<FlexProps>`
    display: flex;
    flex: ${({ auto }) => (auto ? "1 1 auto" : "initial")};
    flex-direction: ${({ column, reverse }) =>
        (column ? "column" : "row") + (reverse ? "-reverse" : "")};
    flex-shrink: ${({ shrink }) => (shrink ? 1 : "initial")};
    align-items: ${({ align }) => align};
    justify-content: ${({ justify }) => justify};
    gap: ${({ gap }) => (gap ? `${gap}px` : "initial")};
    min-width: 0;
    min-height: 0;
`

export default Flex
