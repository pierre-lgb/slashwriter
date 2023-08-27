import { Metadata } from "next"
import AuthComponent from "src/components/AuthComponent"
import Typography from "src/components/ui/Typography"

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a Slashwriter account."
}

export default function SignUpPage() {
    return (
        <>
            <Typography.Title level={2}>Sign Up</Typography.Title>
            <AuthComponent view="signUp" />
        </>
    )
}
