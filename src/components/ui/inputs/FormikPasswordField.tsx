import { useState } from 'react'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import FormikField from './FormikField'
import styles from './FormikPasswordField.module.css'

function FormikPasswordField({ label, ...props }) {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <FormikField
            renderLabel={({ htmlFor }) => (
                <div
                    className={styles.labelContainer}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <label className={styles.label} htmlFor={htmlFor}>
                        {label}
                    </label>
                    <button
                        className={styles.passwordVisibilityButton}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <Visibility fontSize="small" />
                        ) : (
                            <VisibilityOff fontSize="small" />
                        )}
                    </button>
                </div>
            )}
            type={showPassword ? "text" : "password"}
            spellCheck={false}
            {...props}
        />
    )
}

export default FormikPasswordField
