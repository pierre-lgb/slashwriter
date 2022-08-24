import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

function Favorites() {
    return (
        <TransitionOpacity>
            <div>Favoris</div>
        </TransitionOpacity>
    )
}

Favorites.Layout = AppLayout
Favorites.Title = "Favoris"

export const getServerSideProps = withPageAuth()

export default Favorites
