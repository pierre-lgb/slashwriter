import { Children, isValidElement } from "react"

import styles from "./Breadcrumbs.module.scss"
import Typography from "./Typography"

interface BreadcrumbsProps {
    children?: React.ReactNode
    maxItems?: number
    separator?: React.ReactNode
    className?: string
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
    const { children, maxItems = 3, separator = "/", className = "" } = props

    const items = Children.toArray(children)
        .filter((child) => isValidElement(child))
        .map((child, index, { length }) => (
            <li
                className={`${styles.breadcrumbsItem} ${
                    index + 1 === length ? styles.active : ""
                }`}
                key={`child-${index}`}
            >
                {child}
            </li>
        ))

    return (
        <ol className={`${styles.breadcrumbsList} ${className}`}>
            {insertSeparators(
                !maxItems || (maxItems && items.length <= maxItems)
                    ? items
                    : [
                          items[0],
                          <Typography.Text
                              style={{ userSelect: "none" }}
                              key="ellipsis"
                          >
                              ...
                          </Typography.Text>,
                          ...items.slice(
                              items.length - (maxItems - 1),
                              items.length
                          )
                      ],
                separator
            )}
        </ol>
    )
}

function insertSeparators(items, separator) {
    return items.reduce((acc, current, index) => {
        acc.push(current)
        if (index < items.length - 1) {
            acc.push(
                <li
                    className={styles.breadcrumbsSeparator}
                    aria-hidden
                    key={`separator-${index}`}
                >
                    {separator}
                </li>
            )
        }

        return acc
    }, [])
}
