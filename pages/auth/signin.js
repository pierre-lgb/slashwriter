import { useState } from "react"
import { getCsrfToken, signIn } from "next-auth/react"
import * as Yup from "yup"
import Router from "next/router"

import Link from "next/link"
import { Formik } from "formik"
import TextInput from "../../components/forms/TextInput"
import AuthLayout from "../../components/AuthLayout"

import styles from "../../styles/Auth.module.css"

export default function SignIn({ csrfToken }) {
    const [submitError, setSubmitError] = useState("")
    const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
        const { email, password } = values
        await signIn("credentials", {
            redirect: false,
            email,
            password
        })
            .then((status) => {
                if (status.error) {
                    setSubmitError(status.error)
                } else {
                    resetForm()
                    Router.push("/")
                }
            })
            .catch(err => {
                setSubmitError("Un problème est survenu lors de l'authentification.")
            })

        setSubmitting(false)
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Adresse email invalide")
            .required("Veuillez entrer votre adresse email."),
        password: Yup.string()
            .required("Veuillez entrer votre mot de passe.")
    })

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
                    {({
                        handleSubmit,
                        isSubmitting
                    }) => (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {submitError && (
                                <div className="alertError">
                                    {submitError}
                                </div>
                            )}
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <TextInput
                                label="Adresse email" type="email" name="email" validIndicator={false}
                                placeholder="Entrez votre adresse email"
                            />
                            <TextInput
                                label="Mot de passe" type="password" name="password" validIndicator={false}
                                placeholder="Entrez votre mot de passe" spellCheck={false} autoCapitalize="off"
                            />
                            <div className={styles.forgotPassword}>
                                <Link href="#">Mot de passe oublié ?</Link>
                            </div>

                            <button
                                className="submitButton"
                                type="submit"
                                disabled={isSubmitting ? true : false}
                            >Se connecter</button>
                        </form>
                    )}
                </Formik>
                <div className={styles.switchForm}>
                    <p>Pas encore de compte ?</p>
                    <Link href="/auth/signup">En créer un</Link>
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
