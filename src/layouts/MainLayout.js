import { logOut } from "../firebase/auth";
import { useRouter } from "next/router";
import { useAuthUser } from "next-firebase-auth";

import Head from "next/head";
import Link from "next/link";
import NotificationsIcon from "../components/svgs/NotificationsIcon";
import WorkspacesIcon from "../components/svgs/WorkspacesIcon";
import { motion } from "framer-motion";

import styles from "../../styles/layouts/MainLayout.module.css";
import SearchIcon from "../components/svgs/SearchIcon";
import { useEffect, useState } from "react";

const VARIANTS_CONTAINER = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const VARIANTS_ITEM = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
};

const Sidebar = () => {
    const router = useRouter();
    const user = useAuthUser();

    return (
        // <motion.nav id="sidebar" className={styles.sidebar} layoutId="navbar">
        <nav className={styles.sidebar}>
            <div className={styles.sidebarProfileSection}>
                {user && (
                    <>
                        <div className={styles.avatar}></div>
                        <div className={styles.username}>
                            {user.displayName}
                        </div>
                        {/* TODO : ↓ Chevron à la place + Tippy [Déconnexion / Paramètres] */}
                        <div
                            className={styles.moreBtn}
                            onClick={() => logOut()}
                        ></div>
                    </>
                )}
            </div>
            <div
                initial="hidden"
                animate="show"
                className={styles.linksSection}
            >
                <Link href="/search">
                    <a
                        data-active={router?.pathname === "/search"}
                        className={styles.sidebarLink}
                        variants={VARIANTS_ITEM}
                    >
                        <div className={styles.iconWrapper}>
                            <SearchIcon />
                        </div>
                        <div>Rechercher</div>
                    </a>
                </Link>
                <Link href="/notifications">
                    <a
                        data-active={router?.pathname === "/notifications"}
                        className={styles.sidebarLink}
                        variants={VARIANTS_ITEM}
                    >
                        <div className={styles.iconWrapper}>
                            <NotificationsIcon />
                        </div>
                        <div>Notifications</div>
                    </a>
                </Link>
                <Link href="/shared">
                    <a
                        data-active={router?.pathname === "/shared"}
                        className={styles.sidebarLink}
                        variants={VARIANTS_ITEM}
                    >
                        <div className={styles.iconWrapper}>
                            <NotificationsIcon />
                        </div>
                        <div>Partagé avec moi</div>
                    </a>
                </Link>
                <Link href="/spaces">
                    <a
                        data-active={router?.pathname === "/spaces"}
                        className={styles.sidebarLink}
                        variants={VARIANTS_ITEM}
                    >
                        <div className={styles.iconWrapper}>
                            <WorkspacesIcon />
                        </div>
                        <div>Mes espaces</div>
                    </a>
                </Link>
            </div>
        </nav>
    );
};

function MainLayout({ children, pageTitle }) {
    return (
        <>
            <Head>
                <title>{pageTitle || "SlashWriter"}</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.container}>
                <Sidebar />
                {/* <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.navigationArrows}></div>
                        <div className={styles.tabs}></div>
                    </div>
                    <div className={styles.headerRight}>
                        <button
                            onClick={() => {
                                // TODO : Toast "Vous avez été déconnecté"
                                logOut();
                            }}
                            className={styles.logoutBtn}
                            title="Déconnexion"
                        ></button>
                        <div className={styles.avatar}></div>
                    </div>
                </div> */}
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

export default MainLayout;
