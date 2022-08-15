import styles from './Menu.module.css'

function MenuItem({ icon, label, action = () => {}, menu }) {
    return (
        <div
            className={styles.menuItem}
            onClick={() => {
                menu.hide()
                action()
            }}
        >
            <div className={styles.menuItemIconContainer}>{icon}</div>
            <div className={styles.menuItemText}>{label}</div>
        </div>
    )
}

export default MenuItem
