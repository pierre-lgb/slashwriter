import Typography from "src/components/ui/Typography"

import styles from "./Changelog.module.scss"

export default function Changelog() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Typography.Title level={3}>Changelog</Typography.Title>
            </div>
        </div>
    )
}
