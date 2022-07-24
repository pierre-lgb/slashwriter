import Head from "next/head"

import styles from "../styles/pages/Help.module.css"

function Help() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Aide | SlashWriter</title>
                <meta
                    name="description"
                    content="Comment utiliser SlashWriter."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>Aide</main>
        </div>
    )
}

export default Help
