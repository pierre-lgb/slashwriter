import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

export default function Help() {
    return (
        <TransitionOpacity>
            <div>Aide</div>
        </TransitionOpacity>
    )
}

Help.Layout = AppLayout
Help.Title = "Aide"

export const getServerSideProps = withPageAuth()
