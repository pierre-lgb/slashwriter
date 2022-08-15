import { useRouter } from 'next/router'
import { supabaseClient } from 'src/utils/supabase'

import InfoOutlined from '@mui/icons-material/InfoOutlined'
import KeyboardCommandKeyOutlined from '@mui/icons-material/KeyboardCommandKeyOutlined'
import ListAltOutlined from '@mui/icons-material/ListAltOutlined'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'

import { Menu, MenuDivider, MenuItem, MenuItemToggle } from '../ui/navigation/Menu'

function AccountMenu({ children }) {
    const router = useRouter()

    return (
        <Menu
            content={(instance) => (
                <div style={{ width: 250 }}>
                    <MenuItem
                        icon={<PersonOutlined />}
                        label="Profil"
                        action={() => router.push("/settings")}
                        menu={instance}
                    />
                    <MenuItemToggle
                        label="Mode sombre"
                        defaultToggled={false}
                        action={(checked) => {
                            console.log(checked)
                        }}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon={<KeyboardCommandKeyOutlined />}
                        label="Raccourcis clavier"
                        action={() => {}}
                        menu={instance}
                    />
                    <MenuItem
                        icon={<ListAltOutlined />}
                        label="Journal des modifications"
                        action={() => router.push("/changelog")}
                        menu={instance}
                    />
                    <MenuItem
                        icon={<InfoOutlined />}
                        label="Aide"
                        action={() => router.push("/help")}
                        menu={instance}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon={<LogoutOutlined />}
                        label="Déconnexion"
                        action={() => supabaseClient.auth.signOut()}
                        menu={instance}
                    />
                </div>
            )}
        >
            {children}
        </Menu>
    )
}

export default AccountMenu
