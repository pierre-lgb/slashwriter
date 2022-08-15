import styles from './Button.module.css'

function Button({
    label = null,
    icon = null,
    theme = "primary", // theme : primary or secondary
    ...props
}) {
    return (
        <button className={[styles.button, styles[theme]].join(" ")} {...props}>
            {!!icon && <div className={styles.iconWrapper}>{icon}</div>}
            {!!label && <div className={styles.label}>{label}</div>}
        </button>
    )
}

export default Button
