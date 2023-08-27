import Typography from "src/components/ui/Typography"

import styles from "./Settings.module.scss"

export default function Settings() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Typography.Title level={3}>Settings</Typography.Title>
            </div>
        </div>
    )
}
