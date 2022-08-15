import { useState } from 'react'

import CheckBoxFilled from '@mui/icons-material/CheckBox'
import CheckBoxBlank from '@mui/icons-material/CheckBoxOutlineBlank'

import styles from './Checkbox.module.css'

function Checkbox({ label, defaultChecked, onChange, ...props }) {
    const [checked, setChecked] = useState(defaultChecked)

    return (
        <label className={styles.label}>
            <div className={styles.checkboxContainer}>
                <input
                    type="checkbox"
                    className={styles.input}
                    checked={checked}
                    onChange={() => {
                        onChange(!checked)
                        setChecked(!checked)
                    }}
                    {...props}
                    aria-label={label}
                />
                {checked ? (
                    <CheckBoxFilled
                        className={styles.checkbox}
                        data-active={true}
                        aria-hidden="true"
                    />
                ) : (
                    <CheckBoxBlank
                        className={styles.checkbox}
                        data-active={false}
                        aria-hidden="true"
                    />
                )}
            </div>

            {label}
        </label>
    )
}

export default Checkbox
