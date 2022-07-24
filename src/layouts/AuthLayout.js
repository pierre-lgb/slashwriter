import Link from "next/link"
import Head from "next/head"

import styles from "../styles/layouts/AuthLayout.module.css"
import { useAuthUser } from "next-firebase-auth"
import { useRouter } from "next/router"
import { useEffect } from "react"

function AuthLayout({ children, pageTitle }) {
    return (
        <>
            <Head>
                <title>{pageTitle || "SlashWriter - Authentification"}</title>
                <meta
                    name="SlashWriter - Authentification"
                    content="Veuillez vous identifier pour utiliser SlashWriter."
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
                <main>{children}</main>
            </div>
        </>
    )
}

export default AuthLayout
