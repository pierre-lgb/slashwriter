import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth";

import MainLayout from "../../src/layouts/MainLayout";
import Select from "react-select";

import styles from "../../styles/pages/Workspace.module.css";
import AddIcon from "../../src/components/svgs/AddIcon";

function Spaces() {
    return (
        <MainLayout pageTitle={"Slashwriter - Mes espaces"}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Mes espaces</h1>
                <div className={styles.spacesList}>
                    <div className={styles.header}>
                        <div className={styles.sortingSelects}>
                            <div className={styles.sortingModeSelect}>
                                <Select
                                    instanceId="sorting"
                                    options={[
                                        {
                                            value: "alphabetical",
                                            label: "Ordre alphabétique"
                                        },
                                        {
                                            value: "modification",
                                            label: "Date de modification"
                                        },
                                        {
                                            value: "creation",
                                            label: "Date de création"
                                        }
                                    ]}
                                    defaultValue={{
                                        value: "alphabetical",
                                        label: "Ordre alphabétique"
                                    }}
                                />
                            </div>
                            <div className={styles.orderSelect}>
                                <Select
                                    instanceId="order"
                                    options={[
                                        {
                                            value: "ascending",
                                            label: "Croissant"
                                        },
                                        {
                                            value: "descending",
                                            label: "Décroissant"
                                        }
                                    ]}
                                    defaultValue={{
                                        value: "ascending",
                                        label: "Croissant"
                                    }}
                                />
                            </div>
                        </div>
                        <button className={styles.addSpaceBtn}>
                            <AddIcon fill="inherit" />
                            Nouveau
                        </button>
                    </div>
                    <div className={styles.spaces}></div>
                </div>
            </div>
        </MainLayout>
    );
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})();

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(Spaces);
