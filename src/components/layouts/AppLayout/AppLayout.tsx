import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Flex from 'src/components/Flex'
import styled from 'styled-components'

import { useUser } from '@supabase/auth-helpers-react'

import Sidebar from './Sidebar'

function AppLayout(props) {
    const { user, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth")
        }
    }, [user, isLoading])

    return (
        <>
            <Container>
                <Sidebar />
                <Main>{props.children}</Main>
            </Container>
        </>
    )
}

const Container = styled(Flex)`
    width: 100%;
    height: 100%;
`

const Main = styled.main`
    flex-grow: 1;
    overflow-y: auto;
`

export default AppLayout
