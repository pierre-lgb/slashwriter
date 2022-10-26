import { useRouter } from "next/router"
import Flex from "src/components/Flex"
import Menu from "src/components/ui/navigation/Menu"
import { signOut } from "src/utils/supabase"
import styled from "styled-components"

import KeyboardCommandKeyOutlined from "@mui/icons-material/KeyboardCommandKeyOutlined"
import ListAltOutlined from "@mui/icons-material/ListAltOutlined"
import LogoutOutlined from "@mui/icons-material/LogoutOutlined"
import PersonOutlined from "@mui/icons-material/PersonOutlined"

function AccountMenu({ children }) {
    const router = useRouter()

    return (
        <Menu
            content={(instance) => (
                <Container column gap={4}>
                    <Menu.Item
                        icon={<PersonOutlined />}
                        title="Profil"
                        onClick={() => router.push("/settings")}
                        menu={instance}
                    />
                    <Menu.Item
                        icon={<KeyboardCommandKeyOutlined />}
                        title="Raccourcis clavier"
                        onClick={() => {}}
                        menu={instance}
                    />
                    <Menu.Item
                        icon={<ListAltOutlined />}
                        title="Journal des modifications"
                        onClick={() => router.push("/changelog")}
                        menu={instance}
                    />
                    <Menu.Separator />
                    <Menu.Item
                        icon={<LogoutOutlined />}
                        title="Déconnexion"
                        onClick={() => signOut()}
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
