import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Typography from "src/components/ui/Typography"
import { withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import HelpOutlineOutlined from "@mui/icons-material/HelpOutlineOutlined"

function Help() {
    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title>Aide</Typography.Title>
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Help.Layout = AppLayout
Help.Title = "Aide"
Help.Icon = <HelpOutlineOutlined />

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

export default Help
