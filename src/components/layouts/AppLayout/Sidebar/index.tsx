import { useAppSelector } from 'src/store'
import { useUser } from 'src/utils/supabase'

import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import GradeOutlined from '@mui/icons-material/GradeOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'
import ShareOutlined from '@mui/icons-material/ShareOutlined'

import AccountInfo from './AccountInfo'
import FolderList from './FolderList'
import styles from './Sidebar.module.css'
import SidebarLink from './SidebarLink'

function Sidebar(): JSX.Element {
    const { user } = useUser()

    return (
        <nav className={styles.sidebar}>
            <AccountInfo user={user} />
            <div className={styles.linksSection}>
                <SidebarLink
                    href="/search"
                    icon={<SearchOutlined />}
                    label="Rechercher"
                />
                <SidebarLink
                    href="/favorites"
                    icon={<GradeOutlined />}
                    label="Favoris"
                />
                <SidebarLink
                    href="/shares"
                    icon={<ShareOutlined />}
                    label="Partages"
                />
            </div>
            <div className={styles.folderList}>
                {/* Dossiers */}
                {/* TODO : Show folder count*/}
                <FolderList />
            </div>
            <div className={[styles.linksSection, styles.sidebarEnd].join(" ")}>
                <SidebarLink
                    href="/trash"
                    icon={<DeleteOutlined />}
                    label="Corbeille"
                />
                <SidebarLink
                    href="/settings"
                    icon={<SettingsOutlined />}
                    label="Paramètres"
                />
            </div>
        </nav>
    )
}

export default Sidebar
