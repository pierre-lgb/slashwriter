import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Favorites.module.css'
import { withPageAuth } from 'src/utils/supabase'

function Favorites() {
    return (
        <TransitionOpacity>
            <div className={styles.container}>Favoris</div>
        </TransitionOpacity>
    )
}

Favorites.Layout = AppLayout
Favorites.Title = "Favoris"

export const getServerSideProps = withPageAuth()

export default Favorites
