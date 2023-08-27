"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    RiAtLine as EmailIcon,
    RiLockLine as PasswordIcon
} from "react-icons/ri"
import Button from "src/components/ui/Button"
import Flex from "src/components/ui/Flex"
import Input from "src/components/ui/Input"
import Typography from "src/components/ui/Typography"

import styles from "./AuthComponent.module.scss"
import { useSupabase } from "./supabase/SupabaseProvider"

interface AuthComponentProps {
    view: "signIn" | "signUp"
}

export default function AuthComponent(props: AuthComponentProps) {
    const { view } = props

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const router = useRouter()
    const { supabaseClient } = useSupabase()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        if (view === "signIn") {
            const { error: signInError } =
                await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                })

            if (signInError) {
                // Sign in failed
                setError(signInError.message)
                setLoading(false)
                return
            }

            // Sign in succeeded
            router.refresh()
            return
        }

        if (view === "signUp") {
            const { error: signUpError } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`
                }
            })

            if (signUpError) {
                // Sign up failed
                setError(signUpError.message)
                setLoading(false)
                return
            }

            // Sign up succeeded
            router.refresh()
            return
        }
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: 350 }}
            autoComplete="on"
        >
            <Flex column gap={15} style={{ width: "100%" }}>
                <Input
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    icon={<EmailIcon />}
                    size="large"
                />
                <Input
                    label="Password"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    icon={<PasswordIcon />}
                    size="large"
                />
            </Flex>

            {view === "signIn" && (
                <>
                    <Button
                        type="submit"
                        appearance="primary"
                        block
                        size="large"
                        loading={loading}
                    >
                        Sign In
                    </Button>
                    <Link href="/auth/sign-up" passHref legacyBehavior>
                        <Typography.Link>
                            {"Don't have an account? Sign up"}
                        </Typography.Link>
                    </Link>
                </>
            )}

            {view === "signUp" && (
                <>
                    <Button
                        appearance="primary"
                        block
                        size="large"
                        loading={loading}
                    >
                        Sign up
                    </Button>
                    <Link href="/auth/sign-in" passHref legacyBehavior>
                        <Typography.Link>
                            Do you have an account? Sign in
                        </Typography.Link>
                    </Link>
                </>
            )}

            {error && <Typography.Text type="danger">{error}</Typography.Text>}
        </form>
    )
}
