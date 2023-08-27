import styles from "./Loader.module.scss"

interface LoaderProps {
    size?: "small" | "medium" | "large"
}

export default function Loader(props: LoaderProps) {
    const { size = "small" } = props

    return <div className={`${styles.loader} ${styles[size]}`} />
}
