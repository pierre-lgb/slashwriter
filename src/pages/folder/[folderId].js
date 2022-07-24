import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth"
import MainLayout from "../layouts/MainLayout"
import styles from "../styles/pages/Folder.module.css"

function Folder() {
    return <div className={styles.container}>Dossier</div>
}

Folder.getLayout = (page) => (
    <MainLayout pageTitle="Dossier | Slashwriter">{page}</MainLayout>
)

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})()

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Folder)
