import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useUser } from '@supabase/auth-helpers-react'

import styles from './AppLayout.module.css'
import Sidebar from './Sidebar'

function AppLayout(props) {
    const { user, error, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth")
        }
    }, [user])

    return (
        <>
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.main}>{props.children}</main>
            </div>
        </>
    )
}

export default AppLayout
