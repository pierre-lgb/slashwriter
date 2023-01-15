import { RiHome2Line as HomeIcon } from "react-icons/ri"
import AppLayout from "src/components/layouts/AppLayout"
import TransitionOpacity from "src/components/TransitionOpacity"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"
import { useUser, withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

export default function Home() {
    const user = useUser()
    const {
        documents,
        isLoading: isLoadingDocuments,
        error: documentsError
    } = useAppSelector((state) => state.documents)

    const {
        folders,
        isLoading: isLoadingFolders,
        error: foldersError
    } = useAppSelector((state) => state.folders)

    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    <Typography.Title>Accueil</Typography.Title>
                    <pre>{JSON.stringify(documents, null, 2)}</pre>
                    <pre>{JSON.stringify(folders, null, 2)}</pre>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Home.Layout = AppLayout
Home.Title = "Accueil"
Home.Icon = <HomeIcon />

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
