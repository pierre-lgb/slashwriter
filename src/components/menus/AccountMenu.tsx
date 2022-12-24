import { useRouter } from "next/router"
import {
    MdOutlineListAlt as ChangelogIcon,
    MdOutlineLogout as LogoutIcon,
    MdOutlinePerson as PersonIcon
} from "react-icons/md"
import { RiCommandLine as CommandIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import Menu from "src/components/ui/navigation/Menu"
import { supabaseClient } from "src/utils/supabase"
import styled from "styled-components"

function AccountMenu({ children }) {
    const router = useRouter()

    return (
        <Menu
            content={(instance) => (
                <Container column gap={4}>
                    <Menu.Item
                        icon={<PersonIcon />}
                        title="Profil"
                        onClick={() => router.push("/settings")}
                        menu={instance}
                    />
                    <Menu.Item
                        icon={<CommandIcon />}
                        title="Raccourcis clavier"
                        onClick={() => {}}
                        menu={instance}
                    />
                    <Menu.Item
                        icon={<ChangelogIcon />}
                        title="Journal des modifications"
                        onClick={() => router.push("/changelog")}
                        menu={instance}
                    />
                    <Menu.Separator />
                    <Menu.Item
                        icon={<LogoutIcon />}
                        title="Déconnexion"
                        onClick={() => supabaseClient.auth.signOut()}
                        menu={instance}
                    />
                </Container>
            )}
        >
            {children}
        </Menu>
    )
}

const Container = styled(Flex)`
    width: 250px;
`

export default AccountMenu
