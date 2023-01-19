import { Children, isValidElement, ReactNode } from "react"
import styled from "styled-components"

import Typography from "./Typography"

interface BreadcrumbsProps {
    children?: ReactNode
    maxItems?: number
    separator?: ReactNode
    className?: string
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
    const { children, maxItems = 3, separator = "/", className } = props

    const items = Children.toArray(children)
        .filter((child) => isValidElement(child))
        .map((child, index, { length }) => (
            <BreadcrumbsItem
                active={index + 1 === length}
                key={`child-${index}`}
            >
                {child}
            </BreadcrumbsItem>
        ))

    return (
        <BreadcrumbsList className={className}>
            {insertSeparators(
                !maxItems || (maxItems && items.length <= maxItems)
                    ? items
                    : [
                          items[0],
                          <Typography.Text
                              style={{ userSelect: "none" }}
                              key="ellipsis"
                          >
                              …
                          </Typography.Text>,
                          ...items.slice(
                              items.length - (maxItems - 1),
                              items.length
                          )
                      ],
                separator
            )}
        </BreadcrumbsList>
    )
}

const BreadcrumbsList = styled.ol`
    list-style: none;
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    margin: 0;
`

const BreadcrumbsItem = styled.li<{ active: boolean }>`
    font-size: 0.85rem;
    color: ${({ active }) =>
        active ? "var(--color-n900)" : "var(--color-n600)"};
    font-weight: ${({ active }) => (active ? 500 : 400)};
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: all ease-out 0.2s;
    cursor: pointer;

    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    * {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &:hover {
        background-color: var(--color-n100);
    }

    // icons
    svg {
        font-size: 1rem;
        flex-shrink: 0;
    }
`

const BreadcrumbsSeparator = styled.li`
    display: inline-flex;
    align-items: center;
    user-select: none;
    margin: 0 0.5rem;
    color: var(--color-n400);
`

function insertSeparators(items, separator) {
    return items.reduce((acc, current, index) => {
        acc.push(current)
        if (index < items.length - 1) {
            acc.push(
                <BreadcrumbsSeparator aria-hidden key={`separator-${index}`}>
                    {separator}
                </BreadcrumbsSeparator>
            )
        }

        return acc
    }, [])
}
