import { useAuthUser } from "next-firebase-auth"
import { SettingsIcon, SearchIcon } from "../icons"
import SidebarLink from "./SidebarLink"
import styles from "../../styles/components/Sidebar/Sidebar.module.css"

function Sidebar() {
    const user = useAuthUser()
    return (
        <nav>
            <div>{user.displayName}</div>
            <div className={styles.linksSection}>
                <SidebarLink
                    href="/search"
                    icon={<SearchIcon />}
                    label="Rechercher"
                />
                <SidebarLink
                    href="/favorites"
                    // icon={<StarIcon />}
                    label="Favoris"
                />
                <SidebarLink
                    href="/shares"
                    // icon={<ShareIcon />}
                    label="Partages"
                />
            </div>
            <div className={styles.folderList}>Dossiers</div>
            <div>
                <SidebarLink
                    href="/trash"
                    // icon={<TrashIcon />}
                    label="Corbeille"
                />
                <SidebarLink
                    href="/settings"
                    icon={<SettingsIcon />}
                    label="Paramètres"
                />
            </div>
        </nav>
    )
}

export default Sidebar
