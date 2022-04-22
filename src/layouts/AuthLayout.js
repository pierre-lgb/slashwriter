import Link from "next/link";
import Head from "next/head";

import styles from "../../styles/layouts/AuthLayout.module.css";
import { motion } from "framer-motion";

function AuthLayout({ children, pageTitle }) {
    return (
        <>
            <Head>
                <title>{pageTitle || "SlashWriter - Authentification"}</title>
                <meta
                    name="SlashWriter - Authentification"
                    content="Identifiez-vous pour utiliser SlashWriter."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">
                        <a>
                            <picture>
                                <source
                                    srcSet="/assets/logo.svg"
                                    media="(max-width: 600px)"
                                />
                                <img
                                    src="/assets/logoFull.svg"
                                    alt="Logo SlashWriter"
                                />
                            </picture>
                        </a>
                    </Link>
                </div>
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
    );
}

export default AuthLayout;
