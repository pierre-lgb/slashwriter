import { useState } from "react"
import { Formik } from "formik"
import * as Yup from "yup"
import { getCsrfToken, signIn } from "next-auth/react"
import checkUserExists from "../../utils/checkUserExists"

import Link from "next/link"
import AuthLayout from "../../components/layouts/AuthLayout"
import TextInput from "../../components/forms/TextInput"

import styles from "../../styles/pages/Auth.module.css"
import formStyles from "../../styles/Forms.module.css"

export default function SignUp({ csrfToken }) {
    const [submitError, setSubmitError] = useState("")

    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        const res = await fetch('/api/auth/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })

        if (res.status !== 201) {
            return setSubmitError("Un problème est survenu lors de la création du compte.")
        }

        const { email, password } = values
        await signIn("credentials", {
            callbackUrl: "/",
            email,
            password
        })
            .then(() => resetForm())
            .catch(err => {
                setSubmitError("Un problème est survenu lors de l'authentification.")
            })

        setSubmitting(false)
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .trim()
            .min(4, "Nom d'utilisateur trop court.")
            .max(25, "Nom d'utilisateur trop long.")
            .required("Veuillez entrer un nom d'utilisateur.")
            .test("checkUniqueUsername", "Le nom d'utilisateur est déjà pris", async (username) => {
                return !(await checkUserExists({ username }))
            })
            .test("checkValidUsername", "Caractères autorisés : lettres, chiffres, tirets - et _.", (username) => {
                return /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(username)
            }),
        email: Yup.string()
            .trim()
            .email("Adresse email invalide.")
            .required("Veuillez entrer une adresse email.")
            .test("checkUniqueEmail", "L'adresse email est déjà prise.", async (email) => {
                return !(await checkUserExists({ email }))
            }),
        password: Yup.string()
            .test("checkStartOrEndSpaces", "Le mot de passe ne peut pas commencer ou se terminer par des espaces.", (password) => {
                return !/([\s]+[^\s]*[\s]*)|([\s]*[^\s]*[\s]+)/.test(password)
            })
            .min(6, "Mot de passe est trop court.")
            .max(100, "Mot de passe trop long.")
            .required("Veuillez choisir un mot de passe."),
        passwordConfirm: Yup.string()
            .required("Veuillez confirmer votre mot de passe.")
            .oneOf([Yup.ref('password'), null], 'Les deux mots de passe ne correspondent pas.')
    })

    return (
        <AuthLayout>
            <div className={styles.formContainer}>
                <h2 className={styles.formHeader}>Inscription</h2>
                <Formik
                    initialValues={{ username: "", email: "", password: "", passwordConfirm: "", csrfToken }}
                    validationSchema={validationSchema}
                    validateOnBlur={true}
                    validateOnChange={false}
                    onSubmit={handleFormSubmit}
                >
                    {({
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {submitError && (
                                <div className={formStyles.alertError}>
                                    {submitError}
                                </div>
                            )}
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <TextInput
                                label="Nom d'utilisateur" type="text" name="username"
                                placeholder="Entrez un nom d'utilisateur"
                            />
                            <TextInput
                                label="Adresse email" type="email" name="email"
                                placeholder="Entrez votre adresse email"
                            />
                            <TextInput
                                label="Mot de passe" type="password" name="password"
                                placeholder="Entrez votre mot de passe"
                            />
                            <TextInput
                                label="Confirmation du mot de passe" type="password" name="passwordConfirm"
                                placeholder="Entrez votre mot de passe à nouveau"
                            />

                            <button
                                className={formStyles.submitButton}
                                type="submit"
                                disabled={isSubmitting ? true : false}
                            >S'inscrire</button>
                        </form>
                    )}
                </Formik>
                <div className={styles.switchForm}>
                    <p>Déjà inscrit ?</p>
                    <Link href="/auth/signin">Connexion</Link>
                </div>
            </div>
        </AuthLayout>
    )
}

export async function getServerSideProps(context) {
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            csrfToken
        },
    }
}
