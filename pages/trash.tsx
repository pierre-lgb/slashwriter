import { MdOutlineDelete as TrashIcon } from "react-icons/md"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Typography from "src/components/ui/Typography"
import { withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

function Trash() {
    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title>Corbeille</Typography.Title>
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Trash.Layout = AppLayout
Trash.Title = "Corbeille"
Trash.Icon = <TrashIcon />

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

export default Trash
