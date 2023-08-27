import Typography from "src/components/ui/Typography"

import styles from "./Help.module.scss"

export default function Help() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Typography.Title level={3}>Help</Typography.Title>
            </div>
        </div>
    )
}
