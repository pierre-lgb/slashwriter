import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Search.module.css'
import { withPageAuth } from 'src/utils/supabase'

function Search() {
    return (
        <TransitionOpacity>
            <div className={styles.container}>Search</div>
        </TransitionOpacity>
    )
}

Search.Layout = AppLayout
Search.Title = "Rechercher"

export const getServerSideProps = withPageAuth()

export default Search
