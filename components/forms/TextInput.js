import { useState } from "react"
import { ErrorMessage, useField } from "formik"

const TextInput = ({
    label, type,
    validIndicator = true,
    ...props
}) => {
    const [field, meta] = useField(props)

    // show/hide when input of type "password"
    const [passwordShown, setPasswordShown] = useState(false)

    return (
        <div className="formItem">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="formLabel" htmlFor={field.name}>
                    {label}
                </label>
                {type === "password" && (
                    <button
                        type="button" className={passwordShown ? "hidePasswordBtn" : "showPasswordBtn"}
                        onClick={() => setPasswordShown(!passwordShown)}
                        tabIndex={-1}
                    ></button>
                )}
            </div>

            <input
                className={`formInput ${meta.touched && (meta.error ? "isInvalid" : (validIndicator && "isValid"))}`}
                type={type === "password" ? (passwordShown ? "text" : "password") : type} id={field.name}
                {...field} {...props} autoComplete="off"
            />

            <ErrorMessage component="div" name={field.name} className="textError" />
        </div>

    )
}

export default TextInput