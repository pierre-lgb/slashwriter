import Head from "next/head"

import styles from "../styles/pages/Help.module.css"

function Help() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Partage | SlashWriter</title>
                <meta name="description" content="Partage de document." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>Document partagé</main>
        </div>
    )
}

export default Help
