import { MouseEventHandler, ReactNode } from "react"
import styled from "styled-components"

import Flex from "./Flex"

interface CardButtonProps {
    title: string
    description: string
    icon?: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function CardButton(props: CardButtonProps) {
    return (
        <Button onClick={props.onClick}>
            <IconContainer>{props.icon}</IconContainer>
            <Flex column>
                <Title>{props.title}</Title>
                <Description>{props.description}</Description>
            </Flex>
        </Button>
    )
}

const Button = styled.button`
    border: none;
    padding: 0.5rem;
    display: flex;
    outline: none;
    transition: all ease-out 0.2s;
    background: #ffffff;
    border: 1px solid var(--color-n300);
    border-radius: 0.25rem;
    cursor: pointer;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    height: 100%;
    text-align: left;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    * {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &:hover {
        background-color: var(--color-n100);
    }
`

const IconContainer = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    flex-shrink: 0;

    svg {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-n600);
    }
`

const Title = styled.span`
    font-weight: 500;
    font-size: 0.95rem;
`

const Description = styled.span`
    font-weight: 400;
    font-size: 0.8rem;
    line-height: 1.5;
    color: var(--color-n700);
`
