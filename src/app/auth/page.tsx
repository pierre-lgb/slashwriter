import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Authentication"
}

export default function AuthPage() {
    redirect("/auth/sign-in")
}
