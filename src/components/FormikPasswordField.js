import { useState } from "react"
import FormikField from "./FormikField"

import styles from "../styles/components/FormikField.module.css"

function FormikPasswordField({ label, ...props }) {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <FormikField
            renderLabel={({ htmlFor }) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <label className={styles.label} htmlFor={htmlFor}>
                        {label}
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? "H" : "S"}
                        {/* TODO : Show/Hide Icons */}
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
