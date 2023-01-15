import { CSSProperties, ElementType, ReactNode } from "react"
import styled, { css } from "styled-components"

interface TitleProps {
    children?: ReactNode
    className?: string
    style?: CSSProperties
    level?: 1 | 2 | 3 | 4 | 5
}

interface TextProps {
    children?: ReactNode
    className?: string
    style?: CSSProperties
    type?: "default" | "secondary" | "success" | "warning" | "danger"
    mark?: boolean
    code?: boolean
    strong?: boolean
    disabled?: boolean
    underline?: boolean
    strikethrough?: boolean
    small?: boolean
    align?: "left" | "center" | "right" | "justify"
}

interface LinkProps {
    children?: ReactNode
    className?: string
    style?: CSSProperties
    target?: "_blank" | "_self" | "_parent" | "_top" | "framename"
    href?: string
    onClick?: any
}

interface TypographyProps {
    children?: ReactNode
    className?: string
    style?: CSSProperties
    tag?: string
}

function Title(props: TitleProps) {
    const { children, className, style, level = 2 } = props

    return (
        <StyledTitle
            as={`h${level}`}
            style={style}
            className={className}
            level={level}
        >
            {children}
        </StyledTitle>
    )
}

function Text(props: TextProps) {
    const {
        children,
        className,
        style,
        type = "default",
        mark,
        code,
        strong,
        disabled = false,
        underline = false,
        strikethrough = false,
        small = false,
        align = "left"
    } = props

    const tag =
        (mark && "mark") || (code && "code") || (strong && "strong") || "span"

    return (
        <StyledText
            as={tag as ElementType}
            style={style}
            type={type}
            className={className}
            tag={tag}
            disabled={disabled}
            underline={underline}
            strikethrough={strikethrough}
            small={small}
            align={align}
        >
            {children}
        </StyledText>
    )
}

function Link(props: LinkProps) {
    const { children, className, style, target, href, onClick } = props

    return (
        <StyledLink
            onClick={onClick}
            className={className}
            href={href}
            target={target}
            rel="noopener noreferrer"
            style={style}
        >
            {children}
        </StyledLink>
    )
}

export default function Typography(props: TypographyProps) {
    const { children, className, style, tag = "div" } = props

    return (
        <StyledTypography
            as={tag as ElementType}
            style={style}
            className={className}
        >
            {children}
        </StyledTypography>
    )
}

Typography.Title = Title
Typography.Text = Text
Typography.Link = Link

const StyledTitle = styled.div<{ level: 1 | 2 | 3 | 4 | 5 }>`
    color: var(--color-n900);
    margin: 1rem 0;
    font-weight: 700;
    font-size: ${({ level }) =>
        ({
            1: "3rem",
            2: "2.25rem",
            3: "1.5rem",
            4: "1.125rem",
            5: "1rem"
        }[level])};
`

const StyledText = styled.div<{
    type: "default" | "secondary" | "success" | "warning" | "danger"
    tag: "mark" | "code" | "underline" | "strong" | "span"
    disabled: boolean
    underline: boolean
    strikethrough: boolean
    small: boolean
    align: "left" | "center" | "right" | "justify"
}>`
    font-size: 0.95rem;
    line-height: 1.6rem;
    text-align: ${({ align }) => align};

    color: ${({ type }) =>
        ({
            default: "var(--color-n800)",
            secondary: "var(--color-n600)",
            success: "var(--color-green)",
            warning: "var(--color-yellow)",
            danger: "var(--color-red)"
        }[type])};

    ${({ disabled }) =>
        disabled &&
        css`
            opacity: 0.5;
            cursor: not-allowed;
        `};

    ${({ underline }) =>
        underline &&
        css`
            border-bottom: 1px solid var(--color-n700);
        `};

    ${({ strikethrough }) =>
        strikethrough &&
        css`
            text-decoration: line-through;
        `};

    ${({ small }) =>
        small &&
        css`
            font-size: 0.85rem;
        `};

    ${({ tag }) => {
        if (tag === "mark") {
            return css`
                padding: 0;
                background-color: rgb(251, 243, 219);
            `
        }
        if (tag === "code") {
            return css`
                padding: 0.2em 0.4em 0.1em;
                background: hsla(0, 0%, 58.8%, 0.1);
                border: 1px solid hsla(0, 0%, 39.2%, 0.2);
                border-radius: 3px;
                font-weight: 500;
                font-family: "JetBrains Mono", monospace;
            `
        }
        if (tag === "strong") {
            return css`
                font-weight: 500;
            `
        }

        return null
    }};
`

const StyledLink = styled.a`
    font-size: 1rem;
    line-height: 1.6rem;
    color: var(--color-b400);
    border-bottom: 1px solid var(--color-b200);

    &:hover {
        color: var(--color-b500);
    }
`

const StyledTypography = styled.div`
    font-size: 1rem;
    line-height: 1.6rem;
    color: var(--color-n800);
`
