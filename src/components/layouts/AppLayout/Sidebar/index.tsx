import { useEffect, useState } from 'react'
import { supabaseClient, useUser } from 'src/utils/supabase'

import AddOutlined from '@mui/icons-material/AddOutlined'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import FolderOutlined from '@mui/icons-material/FolderOutlined'
import GradeOutlined from '@mui/icons-material/GradeOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import SettingsOutlined from '@mui/icons-material/SettingsOutlined'
import ShareOutlined from '@mui/icons-material/ShareOutlined'

import AccountInfo from './AccountInfo'
import styles from './Sidebar.module.css'
import SidebarButton from './SidebarButton'
import SidebarLink from './SidebarLink'

function Sidebar() {
    const { user } = useUser()
    const [folders, setFolders] = useState([])

    const addFolder = async (name: string) => {
        if (!name) return

        const { data, error } = await supabaseClient.from("folders").insert({
            name
        })

        if (data) {
            setFolders((prev) => [...prev, ...data])
        } else {
            console.error(error)
            alert(error.message)
        }
    }

    const getFolders = async () => {
        const { data: folders, error } = await supabaseClient
            .from("folders")
            .select("id, color, name")
        if (folders) {
            setFolders(folders)
        } else {
            console.error(error)
        }
    }

    useEffect(() => {
        if (user) {
            getFolders()
        }
    }, [user])

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
                <div>
                    {folders.map(({ id, color, name }) => (
                        <SidebarLink
                            key={id}
                            href={`/folder/${id}`}
                            icon={<FolderOutlined sx={{ color }} />}
                            label={name}
                        />
                    ))}
                    <SidebarButton
                        label="Nouveau dossier"
                        icon={<AddOutlined />}
                        action={() => {
                            const folderName = prompt("Nom du dossier :")
                            addFolder(folderName)
                        }}
                    />
                </div>
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
