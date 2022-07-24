import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth"
import MainLayout from "../layouts/MainLayout"
import styles from "../styles/pages/Shares.module.css"

function Shares() {
    return <div className={styles.container}>Partages</div>
}

Shares.getLayout = (page) => (
    <MainLayout pageTitle="Partages | Slashwriter">{page}</MainLayout>
)

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})()

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Shares)
