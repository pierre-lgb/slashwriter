import Link from "next/link"
import { ReactNode } from "react"
import Flex from "src/components/Flex"
import styled, { css } from "styled-components"

interface BreadcrumbItemProps {
    icon?: ReactNode
    text?: string
    href?: string
}

export default function BreadcrumbItem(props: BreadcrumbItemProps) {
    return props.href ? (
        <Link href={props.href} passHref>
            <StyledBreadcrumbItem as="a" gap={10} link>
                {props.icon}
                {props.text}
            </StyledBreadcrumbItem>
        </Link>
    ) : (
        <StyledBreadcrumbItem as="a" gap={10}>
            {props.icon}
            {props.text}
        </StyledBreadcrumbItem>
    )
}

const StyledBreadcrumbItem = styled(Flex)<{ link?: boolean }>`
    color: var(--color-n600);
    flex-shrink: 0;
    align-items: center;
    font-size: 0.95em;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color ease-out 100ms;

    & > svg {
        font-size: 1.25em;
    }

    &:last-child {
        color: var(--color-n900);
        font-weight: 500;
    }

    ${({ link }) =>
        link &&
        css`
            &:hover {
                cursor: pointer;
                background-color: var(--color-n75);
            }
        `}
`
