import Link from "next/link"
import styles from "../../styles/components/Sidebar/SidebarLink.module.css"
import { useRouter } from "next/router"

function SidebarLink({
    href = "#",
    icon = null,
    label = "",
    active = undefined
}) {
    const router = useRouter()
    return (
        <Link href={href}>
            <a
                className={[
                    styles.link,
                    (active !== undefined ? active : router.pathname === href)
                        ? styles.active
                        : ""
                ].join(" ")}
            >
                <div className={styles.linkIconWrapper}>{icon}</div>
                <div className={styles.linkLabel}>{label}</div>
            </a>
        </Link>
    )
}

export default SidebarLink
