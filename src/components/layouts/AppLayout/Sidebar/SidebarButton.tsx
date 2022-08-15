import styles from './SidebarButton.module.css'

function SidebarButton({ action = () => {}, icon = null, label = "" }) {
    return (
        <div className={styles.sidebarButton} onClick={action}>
            <div className={styles.sidebarButtonIconContainer}>{icon}</div>
            <div className={styles.sidebarButtonText}>{label}</div>
        </div>
    )
}

export default SidebarButton
