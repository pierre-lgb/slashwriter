import Checkbox from '../../inputs/Checkbox'
import styles from './Menu.module.css'

function MenuItemToggle({ label, action = (checked: boolean) => {}, defaultToggled }) {
    return (
        <div className={styles.menuItemToggle}>
            <Checkbox
                label={label}
                defaultChecked={defaultToggled}
                onChange={(checked) => action(checked)}
            />
        </div>
    )
}

export default MenuItemToggle
