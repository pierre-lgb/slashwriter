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
import ContainerShiftUp from "../../src/components/animated/ContainerShiftUp";
import { motion } from "framer-motion";
import ContainerOpacity from "../../src/components/animated/ContainerOpacity";

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
                <ContainerShiftUp>
                    <h2 className={styles.formHeader}>Connexion</h2>
                </ContainerShiftUp>
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
                            <ContainerOpacity delay={0.2}>
                                <TextInput
                                    label="Adresse email"
                                    type="email"
                                    name="email"
                                    validIndicator={false}
                                    placeholder="Entrez votre adresse email"
                                />
                            </ContainerOpacity>
                            <ContainerOpacity delay={0.3}>
                                <TextInput
                                    label="Mot de passe"
                                    type="password"
                                    name="password"
                                    validIndicator={false}
                                    placeholder="Entrez votre mot de passe"
                                    spellCheck={false}
                                    autoCapitalize="off"
                                />
                            </ContainerOpacity>

                            <ContainerOpacity
                                delay={0.4}
                                className={styles.forgotPassword}
                            >
                                <Link href="#">Mot de passe oublié ?</Link>
                            </ContainerOpacity>

                            <ContainerShiftUp delay={0.5}>
                                <button
                                    className={formStyles.submitButton}
                                    type="submit"
                                    disabled={isSubmitting ? true : false}
                                >
                                    Se connecter
                                </button>
                            </ContainerShiftUp>
                        </form>
                    )}
                </Formik>
                <ContainerOpacity className={styles.switchForm}>
                    <p>Pas encore de compte ?</p>
                    <Link href="/auth/signup">En créer un</Link>
                </ContainerOpacity>
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
