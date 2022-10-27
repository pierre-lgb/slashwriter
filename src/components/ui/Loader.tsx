import styled from "styled-components"

interface LoaderProps {
    size?: "small" | "medium" | "large"
}

export default function Loader(props: LoaderProps) {
    const { size = "small" } = props
    return <Spin size={size} />
}

const Spin = styled.div<{ size: "small" | "medium" | "large" }>`
    width: ${({ size }) =>
        ({
            small: "1rem",
            medium: "1.25rem",
            large: "1.5rem"
        }[size])};
    height: ${({ size }) =>
        ({
            small: "1rem",
            medium: "1.25rem",
            large: "1.5rem"
        }[size])};
    border: 2px solid var(--color-n400);
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`
