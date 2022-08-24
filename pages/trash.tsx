import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

function Trash() {
    return (
        <TransitionOpacity>
            <div>Corbeille</div>
        </TransitionOpacity>
    )
}

Trash.Layout = AppLayout
Trash.Title = "Corbeille"

export const getServerSideProps = withPageAuth()

export default Trash
