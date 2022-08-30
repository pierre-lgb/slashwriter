import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEventHandler, ReactElement } from 'react'
import Flex from 'src/components/Flex'
import styled, { css } from 'styled-components'

interface SidebarButtonProps {
    title: string
    icon: ReactElement
    onClick: MouseEventHandler<HTMLButtonElement>
}

interface SidebarLinkProps {
    title: string
    icon: ReactElement
    active?: boolean
    href: string
}

export function SidebarButton(props: SidebarButtonProps) {
    return (
        <Container gap={10} align="center" onClick={props.onClick} as="button">
            <IconContainer>{props.icon}</IconContainer>
            <Title>{props.title}</Title>
        </Container>
    )
}

export function SidebarLink(props: SidebarLinkProps) {
    const router = useRouter()
    return (
        <Link href={props.href} passHref>
            <Container
                gap={10}
                align="center"
                active={props.active ?? router.asPath === props.href}
                as="a"
                href={props.href}
            >
                <IconContainer>{props.icon}</IconContainer>
                <Title>{props.title}</Title>
            </Container>
        </Link>
    )
}

const Container = styled(Flex)<{ active?: boolean }>`
    border-radius: 4px;
    padding: 2px;
    color: var(--color-n700);
    border: none;
    font-size: 1em;
    background: none;
    transition: background-color ease-out 50ms, box-shadow ease-out 200ms;
    outline: none;

    ${(props) =>
        props.active &&
        css`
            background: var(--color-b50);
            color: var(--color-b400);
        `}

    &:hover {
        cursor: pointer;
        ${({ active }) =>
            !active &&
            css`
                background-color: var(--color-n75);
            `}
    }

    &:focus {
        box-shadow: 0 0 0 2px var(--color-b200);
    }
`

const Title = styled(Flex)`
    font-size: 0.95em;
`

const IconContainer = styled(Flex)`
    width: 25px;
    height: 25px;
    align-items: center;
    justify-content: center;

    & > svg {
        font-size: 1.25em;
    }
`

const SidebarItem = {
    Link: SidebarLink,
    Button: SidebarButton
}

export default SidebarItem
