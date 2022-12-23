import { useRouter } from "next/router"
import { useEffect } from "react"
import Flex from "src/components/Flex"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { supabaseClient, useUser, withoutPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import { Auth as AuthComponent } from "@supabase/ui"

function Auth() {
    const { user, error } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/home")
        }
    }, [user])

    return (
        <Container column>
            {user ? (
                <LoaderContainer align="center" column>
                    <Loader size="large" />
                    <Typography.Text type="secondary">
                        Redirection...
                    </Typography.Text>
                </LoaderContainer>
            ) : (
                <FormContainer align="center" column>
                    <Typography.Title>Connexion</Typography.Title>
                    <AuthComponent
                        supabaseClient={supabaseClient}
                        socialLayout="vertical"
                        providers={["google", "discord", "github"]}
                        style={{ width: 400 }}
                    />
                </FormContainer>
            )}
        </Container>
    )
}

const Container = styled(Flex)`
    width: 100%;
`
const LoaderContainer = styled(Flex)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: 2rem;
`

const FormContainer = styled(Flex)`
    margin: 100px;
    gap: 1rem;
`

Auth.Title = "Authentification"

export const getServerSideProps = withoutPageAuth()

export default Auth
