import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

export default function Home() {
    return (
        <TransitionOpacity>
            <div>Accueil</div>
        </TransitionOpacity>
    )
}

Home.Layout = AppLayout
Home.Title = "Rechercher"

export const getServerSideProps = withPageAuth()
