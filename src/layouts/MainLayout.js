import Head from "next/head"
import Sidebar from "../components/Sidebar"
import { motion } from "framer-motion"
import styles from "../styles/layouts/MainLayout.module.css"

function MainLayout({ children, pageTitle }) {
    return (
        <>
            <Head>
                <title>{pageTitle || "SlashWriter"}</title>
                <meta
                    name="description"
                    content="Créez, organisez et partagez vos documents."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                <Sidebar />
                <motion.main
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1 }
                    }}
                    className={styles.main}
                >
                    {children}
                </motion.main>
            </div>
        </>
    )
}

export default MainLayout
