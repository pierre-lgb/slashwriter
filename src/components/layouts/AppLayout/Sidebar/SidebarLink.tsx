import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './SidebarLink.module.css'

function SidebarLink({ href = "#", icon = null, label = "", active = undefined }) {
    const router = useRouter()

    return (
        <Link href={href}>
            <a
                className={styles.sidebarLink}
                data-active={active ?? router.asPath === href}
            >
                <div className={styles.sidebarLinkIconContainer}>{icon}</div>
                <div className={styles.sidebarLinkText}>{label}</div>
            </a>
        </Link>
    )
}

export default SidebarLink
