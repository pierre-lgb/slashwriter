import { useRouter } from "next/router"
import { useEffect } from "react"
import Flex from "src/components/Flex"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { supabaseClient, useUser, withoutPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import { Auth as AuthComponent, ThemeSupa } from "@supabase/auth-ui-react"

function Auth() {
    const user = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/home")
        }
    }, [user, router])

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
                        // providers={["google", "github", "discord"]}
                        theme="light"
                        appearance={{
                            theme: ThemeSupa,
                            style: {
                                container: { width: 350 },
                                input: { letterSpacing: "0px" }
                            },
                            variables: {
                                default: {
                                    fonts: {
                                        bodyFontFamily: "inherit",
                                        labelFontFamily: "inherit",
                                        buttonFontFamily: "inherit",
                                        inputFontFamily: "inherit"
                                    },
                                    fontSizes: {
                                        baseBodySize: "inherit",
                                        baseLabelSize: "inherit",
                                        baseButtonSize: "inherit",
                                        baseInputSize: "inherit"
                                    }
                                }
                            }
                        }}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: "Adresse email",
                                    email_input_placeholder:
                                        "Entrez votre adresse email",
                                    password_label: "Mot de passe",
                                    password_input_placeholder:
                                        "Entrez votre mot de passe",
                                    button_label: "Connexion",
                                    link_text: "Déjà enregistré ? Se connecter"
                                },
                                sign_up: {
                                    email_label: "Adresse email",
                                    email_input_placeholder:
                                        "Entrez votre adresse email",
                                    password_label: "Mot de passe",
                                    password_input_placeholder:
                                        "Entrez votre mot de passe",
                                    button_label: "Inscription",
                                    link_text:
                                        "Pas encore de compte ? S'inscrire"
                                },
                                forgotten_password: {
                                    link_text: "Mot de passe oublié ?"
                                }
                            }
                        }}
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
