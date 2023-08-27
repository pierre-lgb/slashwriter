import { Metadata } from "next"
import AuthComponent from "src/components/AuthComponent"
import Typography from "src/components/ui/Typography"

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your SlashWriter account."
}

export default function SignInPage() {
    return (
        <>
            <Typography.Title level={2}>Sign In</Typography.Title>
            <AuthComponent view="signIn" />
        </>
    )
}
