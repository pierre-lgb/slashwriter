import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Shares.module.css'
import { withPageAuth } from 'src/utils/supabase'

function Shares() {
    return (
        <TransitionOpacity>
            <div className={styles.container}>Partages</div>
        </TransitionOpacity>
    )
}

Shares.Layout = AppLayout
Shares.Title = "Partages"

export const getServerSideProps = withPageAuth()

export default Shares
