import Typography from "src/components/ui/Typography"

import styles from "./Trash.module.scss"

export default function Trash() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Typography.Title level={3}>Trash</Typography.Title>
            </div>
        </div>
    )
}
