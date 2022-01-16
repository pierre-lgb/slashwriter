import MainLayout from "../../components/layouts/MainLayout"
import Select from "react-select"

import styles from "../../styles/pages/Workspace.module.css"

export default function Workspace() {
    return (
        <MainLayout>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Mes espaces</h1>
                <div className={styles.spacesList}>
                    <div className={styles.header}>
                        <div className={styles.sortingSelects}>
                            <div className={styles.sortingModeSelect}>
                                <Select
                                    options={[
                                        { value: "alphabetical", label: "Ordre alphabétique" },
                                        { value: "modification", label: "Date de modification" },
                                        { value: "creation", label: "Date de création" },
                                        { value: "custom", label: "Personnalisé" }
                                    ]}
                                    defaultValue={{ value: "alphabetical", label: "Ordre alphabétique" }}
                                />
                            </div>
                            <div className={styles.orderSelect}>
                                <Select
                                    options={[
                                        { value: "ascending", label: "Croissant" },
                                        { value: "descending", label: "Décroissant" }
                                    ]}
                                    defaultValue={{ value: "ascending", label: "Croissant" }}
                                />
                            </div>
                        </div>
                        <button className={styles.addSpaceBtn}>
                            Nouveau
                        </button>
                    </div>
                    <div className={styles.spaces}>

                    </div>
                </div>


            </div>
        </MainLayout>
    )
}