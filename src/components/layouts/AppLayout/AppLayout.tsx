import { useRouter } from "next/router"
import { useEffect } from "react"
import Flex from "src/components/Flex"
import styled from "styled-components"

import { useUser } from "@supabase/auth-helpers-react"

import Header from "./Header"
import Sidebar from "./Sidebar"

function AppLayout(props) {
    const user = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push("/auth")
        }
    }, [user, router])

    return (
        <>
            <Container>
                <Sidebar />
                <Main>
                    <Header pageTitle={props.title} pageIcon={props.icon} />
                    <PageContent>{props.children}</PageContent>
                </Main>
            </Container>
        </>
    )
}

const Container = styled(Flex)`
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    @media print {
        .sidebar {
            display: none;
        }

        .header {
            display: none;
        }
    }
`

const Main = styled.main`
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    width: 100%;
    overflow: hidden;

    @media print {
        display: block;
        max-height: unset;
    }
`

const PageContent = styled.div`
    overflow-y: auto;
    width: 100%;

    @media print {
        overflow-y: hidden;
    }
`

export default AppLayout
