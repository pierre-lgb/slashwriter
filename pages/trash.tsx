import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Trash.module.css'
import { withPageAuth } from 'src/utils/supabase'

function Trash() {
    return (
        <TransitionOpacity>
            <div className={styles.container}>Corbeille</div>
        </TransitionOpacity>
    )
}

Trash.Layout = AppLayout
Trash.Title = "Corbeille"

export const getServerSideProps = withPageAuth()

export default Trash
