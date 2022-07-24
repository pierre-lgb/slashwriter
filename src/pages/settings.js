import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth"
import MainLayout from "../layouts/MainLayout"
import styles from "../styles/pages/Settings.module.css"

function Settings() {
    return <div className={styles.container}>Paramètres</div>
}

Settings.getLayout = (page) => (
    <MainLayout pageTitle="Paramètres | Slashwriter">{page}</MainLayout>
)

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})()

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Settings)
