import { useRouter } from "next/navigation"
import {
    RiCommandLine as CommandIcon,
    RiEqualizerLine as SettingsIcon,
    RiFileList3Line as ChangelogIcon,
    RiLogoutBoxRLine as LogoutIcon
} from "react-icons/ri"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Menu from "src/components/ui/Menu"

import styles from "./AccountMenu.module.scss"

function AccountMenu({ children }) {
    const { supabaseClient } = useSupabase()
    const router = useRouter()

    return (
        <Menu
            content={(instance) => (
                <div className={styles.accountMenu}>
                    <Menu.Item
                        icon={<SettingsIcon />}
                        title="Settings"
                        onClick={() => router.push("/settings")}
                        menu={instance}
                    />
                    <Menu.Item
                        icon={<CommandIcon />}
                        title="Keyboard shortcuts"
                        onClick={() => {}}
                        menu={instance}
                    />
                    <Menu.Item
                        icon={<ChangelogIcon />}
                        title="Changelog"
                        onClick={() => router.push("/changelog")}
                        menu={instance}
                    />
                    <Menu.Separator />
                    <Menu.Item
                        icon={<LogoutIcon />}
                        title="Log out"
                        onClick={() => supabaseClient.auth.signOut()}
                        menu={instance}
                        style={{ color: "var(--color-red)" }}
                    />
                </div>
            )}
            popperOptions={{
                modifiers: [
                    {
                        name: "preventOverflow",
                        enabled: false
                    }
                ]
            }}
        >
            {children}
        </Menu>
    )
}

export default AccountMenu
