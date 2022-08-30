import styled from 'styled-components'

export default function BreadcrumbSeparator() {
    return <StyledSeparator>/</StyledSeparator>
}

const StyledSeparator = styled.span`
    color: var(--color-n400);
`
