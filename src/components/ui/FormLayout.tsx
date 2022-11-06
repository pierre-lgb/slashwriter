import { CSSProperties, ReactNode } from "react"
import styled, { css } from "styled-components"

interface FormLayoutProps {
    children?: ReactNode
    className?: string
    align?: string
    error?: string
    label?: string
    description?: string
    layout?: "horizontal" | "vertical"
    style?: CSSProperties
    flex?: boolean
    size?: "small" | "medium" | "large"
    id?: string
}

export default function FormLayout(props: FormLayoutProps) {
    const {
        children,
        className,
        align,
        error,
        label,
        description,
        layout = "vertical",
        style,
        flex = false,
        size = "medium",
        id
    } = props

    return (
        <Container size={size} flex={flex} align={align} className={className}>
            {!!label || layout === "horizontal" ? (
                <LabelContainer layout={layout}>
                    {!!label && <Label htmlFor={id}>{label}</Label>}
                </LabelContainer>
            ) : null}
            <ContentContainer layout={layout} style={style} align={align}>
                {children}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {description && <Description>{description}</Description>}
            </ContentContainer>
        </Container>
    )
}

const Container = styled.div<{
    size: "small" | "medium" | "large"
    flex: boolean
    align: string
}>`
    font-size: 0.9rem;
    line-height: 1.25rem;
    width: 100%;

    ${({ flex }) =>
        flex
            ? css`
                  display: flex;
                  justify-content: space-between;
              `
            : css`
                  display: grid;
                  gap: 0.5rem;

                  @media (min-width: 768px) {
                      grid-template-columns: repeat(12, minmax(0, 1fr));
                      gap: 1rem;
                  }
              `}

    ${({ align }) =>
        align === "right"
            ? css`
                  div:last-child {
                      text-align: right;
                  }
              `
            : align === "left"
            ? css`
                  div:first-child {
                      order: 2;
                  }
                  div:last-child {
                      order: 1;
                  }
              `
            : null}
`

const LabelContainer = styled.div<{
    layout: "horizontal" | "vertical"
}>`
    ${({ layout }) =>
        layout === "horizontal"
            ? css`
                  grid-column: span 4 / span 4;
              `
            : css`
                  grid-column: span 12 / span 12;
              `}
`

const Label = styled.label`
    display: block;
    color: var(--color-n800);
    font-weight: 500;
`

const ContentContainer = styled.div<{
    layout: "horizontal" | "vertical"
    align: string
}>`
    ${({ layout }) =>
        layout === "horizontal"
            ? css`
                  grid-column: span 8 / span 8;
              `
            : css`
                  grid-column: span 12 / span 12;
              `}

    ${({ align }) =>
        align === "right" &&
        css`
            text-align: right;
        `}
`

const ErrorMessage = styled.p`
    margin-top: 0.5rem;
    color: var(--color-red);
`

const Description = styled.p`
    margin-top: 0.5rem;
    color: var(--color-n600);
`
