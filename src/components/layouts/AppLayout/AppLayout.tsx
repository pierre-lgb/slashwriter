import styles from "./AppLayout.module.scss"
import Header from "./Header"
import QuickSearchModal from "./QuickSearchModal"
import Sidebar from "./Sidebar"

interface AppLayoutProps {
    children: React.ReactNode
}

export default function AppLayout(props: AppLayoutProps) {
    const { children } = props

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
                <Header />
                <div className={styles.pageContent}>{children}</div>
            </main>
            <QuickSearchModal />
        </div>
    )
}
