import { useState } from "react";
import { ErrorMessage, Field, useField } from "formik";

import formStyles from "../../../styles/Forms.module.css";

const TextInput = ({ label, type, validIndicator = true, ...props }) => {
    const [field, meta] = useField(props);

    // show/hide if input of type "password"
    const [passwordShown, setPasswordShown] = useState(false);

    return (
        <div className={formStyles.formItem}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className={formStyles.formLabel} htmlFor={field.name}>
                    {label}
                </label>
                {type === "password" && (
                    <button
                        type="button"
                        className={
                            passwordShown
                                ? formStyles.showPasswordBtn
                                : formStyles.hidePasswordBtn
                        }
                        onClick={() => setPasswordShown(!passwordShown)}
                        tabIndex={-1}
                    ></button>
                )}
            </div>

            <Field
                className={`${formStyles.formInput} ${
                    meta.touched &&
                    (meta.error
                        ? formStyles.isInvalid
                        : validIndicator && formStyles.isValid)
                }`}
                type={
                    type === "password"
                        ? passwordShown
                            ? "text"
                            : "password"
                        : type
                }
                id={field.name}
                {...field}
                {...props}
                autoComplete="off"
            />

            <ErrorMessage
                component="div"
                className={formStyles.textError}
                name={field.name}
            />
        </div>
    );
};

export default TextInput;
