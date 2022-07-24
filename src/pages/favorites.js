import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth"
import MainLayout from "../layouts/MainLayout"
import styles from "../styles/pages/Favorites.module.css"

function Favorites() {
    return <div className={styles.container}>Favoris</div>
}

Favorites.getLayout = (page) => (
    <MainLayout pageTitle="Favoris | Slashwriter">{page}</MainLayout>
)

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})()

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Favorites)
