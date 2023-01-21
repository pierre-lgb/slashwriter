import Link from "next/link"
import { ReactNode } from "react"
import Flex from "src/components/Flex"
import Loader from "src/components/ui/Loader"
import styled from "styled-components"

export interface DocumentLinkProps {
    href?: string
    title: string
    status: string
    style?: any
    loading?: boolean
    actions?: ReactNode
    badge?: ReactNode
    [x: string]: any
}

export default function DocumentLink(props: DocumentLinkProps) {
    const {
        href,
        title,
        status,
        style,
        actions,
        badge,
        loading = false,
        ...otherProps
    } = props
    return (
        <Link href={href} {...otherProps}>
            <Container style={style}>
                <DocumentIcon />
                <Flex
                    auto
                    column
                    justify="center"
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            <DocumentTitle>{title}</DocumentTitle>
                            <DocumentStatus>{status}</DocumentStatus>
                        </>
                    )}
                </Flex>
                {badge && <Badge>{badge}</Badge>}
                <div className="actions">{actions}</div>
            </Container>
        </Link>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    border-radius: 5px;
    gap: 0.5rem;
    padding: 5px 15px 5px 5px;
    user-select: none;
    cursor: pointer;
    transition: background-color 0.2s;

    .actions {
        opacity: 0;
        transition: opacity 0.1s;
    }

    &:hover {
        background-color: var(--color-n75);

        .actions {
            opacity: 1;
        }
    }
`

const DocumentIcon = styled.div`
    width: 32px;
    height: 44px;
    border: 1px solid var(--color-n300);
    border-radius: 4px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgb(200,200,200)' width='21' height='32'%3E%3Cg%3E%3Crect width='25' height='2' y='0'/%3E%3Crect width='25' height='2' y='4'/%3E%3Crect width='15' height='2' y='8'/%3E%3Crect width='30' height='2' y='14'/%3E%3Crect width='20' height='2' y='18'/%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center center;
    flex-shrink: 0;
`

const DocumentTitle = styled.span`
    color: var(--color-n800);
    font-weight: 500;
    font-size: 0.95rem;
    max-width: 90%;
    padding-bottom: 1px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 1.2;
`

const Badge = styled.span`
    padding: 0.1em 0.4em 0.1em;
    background: hsla(0, 0%, 58.8%, 0.1);
    border: 1px solid hsla(0, 0%, 39.2%, 0.2);
    border-radius: 3px;
    font-weight: 500;

    font-size: 0.8rem;
    font-family: "JetBrains Mono", monospace;
`

const DocumentStatus = styled.span`
    font-size: 0.8em;
    color: var(--color-n600);
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.2;
`
