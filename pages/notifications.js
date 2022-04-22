import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth";
import MainLayout from "../src/layouts/MainLayout";

function Notifications() {
    return (
        <MainLayout>
            <div className="styles.container">Notifications</div>
        </MainLayout>
    );
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})();

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Notifications);
