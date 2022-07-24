import { useField, Field, ErrorMessage } from "formik"

import styles from "../styles/components/FormikField.module.css"

function FormikField({
    label, // Input label
    type = "text", // Input type : text, email, password, ...
    validIndicator = true, // Green indicator if the value is valid
    renderLabel = null, // Custom label rendering function
    ...props
}) {
    const [field, meta] = useField(props)

    return (
        <div className={styles.fieldWrapper}>
            {renderLabel ? (
                renderLabel({ htmlFor: field.name })
            ) : label ? (
                <label className={styles.label} htmlFor={field.name}>
                    {label}
                </label>
            ) : null}

            <Field
                className={[
                    styles.field,
                    meta.touched &&
                        (meta.error
                            ? styles.invalidField
                            : validIndicator
                            ? styles.validField
                            : "")
                ].join(" ")}
                type={type}
                id={field.name}
                autoCapitalize="false"
                {...field}
                {...props}
            />

            <ErrorMessage
                component="div"
                className={styles.errorMessage}
                name={field.name}
            />
        </div>
    )
}

export default FormikField
