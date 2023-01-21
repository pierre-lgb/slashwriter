import { RiQuestionLine as HelpIcon } from "react-icons/ri"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Typography from "src/components/ui/Typography"
import { withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

function Help() {
    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title level={3}>Aide</Typography.Title>
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Help.Layout = AppLayout
Help.Title = "Aide"
Help.Icon = <HelpIcon />

const Container = styled.div`
    padding: 50px 25px;
`

const Content = styled.div`
    margin: 25px auto;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
`

export const getServerSideProps = withPageAuth()

export default Help
