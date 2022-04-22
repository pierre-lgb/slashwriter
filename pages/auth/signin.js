import { useState } from "react";
import { logIn } from "../../src/firebase/auth";
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth";
import * as Yup from "yup";

import Link from "next/link";
import { Formik } from "formik";
import TextInput from "../../src/components/forms/TextInput";
import AuthLayout from "../../src/layouts/AuthLayout";

import styles from "../../styles/pages/Auth.module.css";
import formStyles from "../../styles/Forms.module.css";

function SignIn({ csrfToken }) {
    const [submitError, setSubmitError] = useState("");
    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        const { email, password } = values;

        await logIn({ email, password })
            .then(() => resetForm())
            .catch((error) => {
                switch (error.code) {
                    case "auth/user-disabled":
                        setSubmitError("Ce compte a été désactivé.");
                        break;
                    case "auth/user-not-found":
                        setSubmitError("Aucun utilisateur trouvé.");
                        break;
                    case "auth/wrong-password":
                        setSubmitError("Mot de passe incorrect.");
                        break;
                    default:
                        console.error(error);
                        setSubmitError(
                            `Une erreur est survenue : "${error.code}"`
                        );
                }

                setSubmitting(false);
            });
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Adresse email invalide")
            .required("Veuillez entrer votre adresse email."),
        password: Yup.string().required("Veuillez entrer votre mot de passe.")
    });

    return (
        <AuthLayout>
            <div className={styles.formContainer}>
                <h2 className={styles.formHeader}>Connexion</h2>
                <Formik
                    initialValues={{ email: "", password: "", csrfToken }}
                    validationSchema={validationSchema}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleSubmit, isSubmitting }) => (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {submitError && (
                                <div className={formStyles.alertError}>
                                    {submitError}
                                </div>
                            )}
                            <TextInput
                                label="Adresse email"
                                type="email"
                                name="email"
                                validIndicator={false}
                                placeholder="Entrez votre adresse email"
                            />
                            <TextInput
                                label="Mot de passe"
                                type="password"
                                name="password"
                                validIndicator={false}
                                placeholder="Entrez votre mot de passe"
                                spellCheck={false}
                                autoCapitalize="off"
                            />
                            <div className={styles.forgotPassword}>
                                <Link href="#">Mot de passe oublié ?</Link>
                            </div>

                            <button
                                className={formStyles.submitButton}
                                type="submit"
                                disabled={isSubmitting ? true : false}
                            >
                                Se connecter
                            </button>
                        </form>
                    )}
                </Formik>
                <div className={styles.switchForm}>
                    <p>Pas encore de compte ?</p>
                    <Link href="/auth/signup">En créer un</Link>
                </div>
            </div>
        </AuthLayout>
    );
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP
})();

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP
})(SignIn);
