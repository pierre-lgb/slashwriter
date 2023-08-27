import { MouseEventHandler, ReactNode } from "react"
import Flex from "src/components/ui/Flex"

import styles from "./CardButton.module.scss"

interface CardButtonProps {
    title: string
    description: string
    icon?: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function CardButton(props: CardButtonProps) {
    return (
        <button className={styles.button} onClick={props.onClick}>
            <div className={styles.iconContainer}>{props.icon}</div>
            <Flex column>
                <span className={styles.title}>{props.title}</span>
                <span className={styles.description}>{props.description}</span>
            </Flex>
        </button>
    )
}
