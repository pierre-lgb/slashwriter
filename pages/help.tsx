import Head from 'next/head'
import styles from 'src/styles/Help.module.css'

function Help() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>Aide</main>
        </div>
    )
}

Help.Title = "Aide"

export default Help
