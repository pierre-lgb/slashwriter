import "server-only"

import { cookies } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import Flex from "src/components/ui/Flex"
import Typography from "src/components/ui/Typography"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import styles from "./Auth.module.scss"

async function NotAuthenticatedLayout({
    children
}: {
    children: React.ReactNode
}) {
    const supabase = createServerComponentClient({ cookies })

    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (session) {
        redirect("/home")
    }

    return (
        <div className={styles.container}>
            <Flex className={styles.formContainer} align="center" column>
                <Image
                    src="/assets/logo.svg"
                    width={64}
                    height={64}
                    alt="logo"
                    priority
                />

                {children}
            </Flex>
        </div>
    )
}

export default NotAuthenticatedLayout
