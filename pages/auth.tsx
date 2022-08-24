import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { supabaseClient, useUser, withoutPageAuth } from 'src/utils/supabase'

import { Auth as AuthComponent } from '@supabase/ui'

function Auth() {
    const { user, error } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push("/home")
        }
    }, [user])

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}
            >
                <div style={{ margin: "80px 0" }}>
                    <Image
                        src="/assets/logoFull.svg"
                        width={200}
                        height={50}
                        layout="fixed"
                    />
                </div>
                {user ? (
                    <strong>Vous êtes connecté. Redirection...</strong>
                ) : (
                    <AuthComponent
                        supabaseClient={supabaseClient}
                        socialLayout="vertical"
                        providers={["google", "discord", "github"]}
                        style={{ width: 400 }}
                    />
                )}
            </div>
        </div>
    )
}

Auth.Title = "Authentification"

export const getServerSideProps = withoutPageAuth()

export default Auth
