import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

function Settings() {
    return (
        <TransitionOpacity>
            <div>Paramètres</div>
        </TransitionOpacity>
    )
}

Settings.Layout = AppLayout
Settings.Title = "Paramètres"

export const getServerSideProps = withPageAuth()

export default Settings
