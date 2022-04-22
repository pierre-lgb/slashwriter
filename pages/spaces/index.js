import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth";
import MainLayout from "../../src/layouts/MainLayout";
import Select from "react-select";

import { motion } from "framer-motion";
import styles from "../../styles/pages/Workspace.module.css";
import AddIcon from "../../src/components/svgs/AddIcon";
import ContainerShiftUp from "../../src/components/animated/ContainerShiftUp";

const framerFiltersHeaderVariants = {
    hidden: { y: 30, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2
        }
    }
};

const framerFiltersHeaderItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
};

function Spaces() {
    return (
        <MainLayout pageTitle={"Slashwriter - Mes espaces"}>
            <div className={styles.container}>
                <ContainerShiftUp delay={0.1}>
                    <h1 className={styles.pageTitle}>Mes espaces</h1>
                </ContainerShiftUp>

                <div className={styles.spacesList}>
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={framerFiltersHeaderVariants}
                        className={styles.header}
                    >
                        <motion.div
                            className={styles.sortingSelects}
                            variants={framerFiltersHeaderItemVariants}
                        >
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
                        </motion.div>
                        <motion.button
                            className={styles.addSpaceBtn}
                            variants={framerFiltersHeaderItemVariants}
                        >
                            <AddIcon fill="inherit" />
                            Nouveau
                        </motion.button>
                    </motion.div>
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
