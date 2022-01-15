import Link from "next/link";
import styles from "../styles/404.module.css"

export default function NotFound() {
    return (
        <div className={styles.container}>
            <img src="/assets/404.svg" alt="404" />
            <h2>Page introuvable</h2>
            <Link href="/">
                <a>Retourner à l'accueil</a>
            </Link>
        </div>
    )
}
