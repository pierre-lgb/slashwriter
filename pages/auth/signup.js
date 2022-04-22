import { useState } from "react";
import Router from "next/router";
import * as Yup from "yup";
import {
    AuthAction,
    withAuthUser,
    withAuthUserTokenSSR
} from "next-firebase-auth";
import { isUsernameAlreadyInUse, signUp } from "../../src/firebase/auth";

import Link from "next/link";
import AuthLayout from "../../src/layouts/AuthLayout";
import TextInput from "../../src/components/forms/TextInput";
import { Formik } from "formik";

import styles from "../../styles/pages/Auth.module.css";
import formStyles from "../../styles/Forms.module.css";
import { useRef } from "react";
import ContainerShiftUp from "../../src/components/animated/ContainerShiftUp";
import ContainerOpacity from "../../src/components/animated/ContainerOpacity";

const cacheTest = (asyncValidate) => {
    let _valid = false;
    let _value = "";

    return async (value) => {
        if (value !== _value) {
            const response = await asyncValidate(value);
            _value = value;
            _valid = response;
            return response;
        }
        return _valid;
    };
};

function SignUp({ csrfToken }) {
    const [submitError, setSubmitError] = useState("");
    const usernameUniqueTest = useRef(
        cacheTest(async (value) => {
            const isValid = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(value);
            return isValid
                ? !(await isUsernameAlreadyInUse(value)) // Username is valid : check
                : true; // Username is not valid : do not check
        })
    );

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        const { email, password, username } = values;
        signUp({ email, password, username })
            .then(() => {
                resetForm();
                Router.push("/");
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        setSubmitError("L'adresse email est déjà utilisée.");
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
        username: Yup.string()
            .trim()
            .min(4, "Nom d'utilisateur trop court.")
            .max(25, "Nom d'utilisateur trop long.")
            .required("Veuillez entrer un nom d'utilisateur.")
            .test(
                "checkValidUsername",
                "Caractères autorisés : lettres, chiffres, tirets - et _.",
                (username) => {
                    return /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(username);
                }
            )
            .test(
                "checkUniqueUsername",
                "Le nom d'utilisateur est déjà pris",
                usernameUniqueTest.current
            ),
        email: Yup.string()
            .trim()
            .email("Adresse email invalide.")
            .required("Veuillez entrer une adresse email."),
        password: Yup.string()
            .test(
                "checkStartOrEndWithSpaces",
                "Le mot de passe ne peut pas commencer ou se terminer par des espaces.",
                (password) => {
                    return !/([\s]+[^\s]*[\s]*)|([\s]*[^\s]*[\s]+)/.test(
                        password
                    );
                }
            )
            .min(6, "Mot de passe trop court.")
            .max(100, "Mot de passe trop long.")
            .required("Veuillez choisir un mot de passe."),
        passwordConfirm: Yup.string()
            .required("Veuillez confirmer votre mot de passe.")
            .oneOf(
                [Yup.ref("password"), null],
                "Les deux mots de passe ne correspondent pas."
            )
    });

    return (
        <AuthLayout>
            <div className={styles.formContainer}>
                <ContainerShiftUp delay={0.1}>
                    <h2 className={styles.formHeader}>Inscription</h2>
                </ContainerShiftUp>
                <Formik
                    initialValues={{
                        username: "",
                        email: "",
                        password: "",
                        passwordConfirm: ""
                    }}
                    validationSchema={validationSchema}
                    validateOnBlur={true}
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
                                    label="Nom d'utilisateur"
                                    type="text"
                                    name="username"
                                    placeholder="Entrez un nom d'utilisateur"
                                />
                            </ContainerOpacity>
                            <ContainerOpacity delay={0.3}>
                                <TextInput
                                    label="Adresse email"
                                    type="email"
                                    name="email"
                                    placeholder="Entrez votre adresse email"
                                />
                            </ContainerOpacity>
                            <ContainerOpacity delay={0.4}>
                                <TextInput
                                    label="Mot de passe"
                                    type="password"
                                    name="password"
                                    placeholder="Entrez votre mot de passe"
                                />
                            </ContainerOpacity>
                            <ContainerOpacity delay={0.5}>
                                <TextInput
                                    label="Confirmation du mot de passe"
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="Entrez votre mot de passe à nouveau"
                                />
                            </ContainerOpacity>
                            <ContainerShiftUp delay={0.7}>
                                <button
                                    className={formStyles.submitButton}
                                    type="submit"
                                    disabled={isSubmitting ? true : false}
                                >
                                    S'inscrire
                                </button>
                            </ContainerShiftUp>
                        </form>
                    )}
                </Formik>
                <ContainerOpacity delay={0.7}>
                    <div className={styles.switchForm}>
                        <p>Déjà inscrit ?</p>
                        <Link href="/auth/signin">Connexion</Link>
                    </div>
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
})(SignUp);
