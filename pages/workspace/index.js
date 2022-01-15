import { signOut } from "next-auth/react"
import Router from "next/router"

export default function Workspace() {
    return (
        <div>
            <button onClick={() => {
                signOut({ redirect: false })
                    .then(() => Router.push("/auth/signed-out"))
            }}>Logout</button>
        </div>
    )
}