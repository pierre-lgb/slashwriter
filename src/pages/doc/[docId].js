import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth"
import MainLayout from "../layouts/MainLayout"
import styles from "../styles/pages/Document.module.css"

function Document() {
    return <div className={styles.container}>Document</div>
}

Document.getLayout = (page) => (
    <MainLayout pageTitle="Document | Slashwriter">{page}</MainLayout>
)

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})()

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Document)
