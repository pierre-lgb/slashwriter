import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Typography from "src/components/ui/Typography"
import { withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import TuneOutlined from "@mui/icons-material/TuneOutlined"

function Settings() {
    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title>Paramètres</Typography.Title>
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Settings.Layout = AppLayout
Settings.Title = "Paramètres"
Settings.Icon = <TuneOutlined />

const Container = styled.div`
    padding: 100px 25px;
`

const Content = styled.div`
    margin: 25px auto;
    max-width: 700px;
    display: flex;
    flex-direction: column;
`

export const getServerSideProps = withPageAuth()

export default Settings
