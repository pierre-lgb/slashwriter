import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Settings.module.css'
import { withPageAuth } from 'src/utils/supabase'

function Settings() {
    return (
        <TransitionOpacity>
            <div className={styles.container}>Paramètres</div>
        </TransitionOpacity>
    )
}

Settings.Layout = AppLayout
Settings.Title = "Paramètres"

export const getServerSideProps = withPageAuth()

export default Settings
