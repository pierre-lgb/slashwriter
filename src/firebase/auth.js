import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    getAuth,
    signOut
} from "firebase/auth"
import { child, get, ref } from "firebase/database"
import { init } from "next-firebase-auth"
import { firebaseConfig } from "."
import { database as db } from "./database"

export const initAuth = () => {
    init({
        authPageURL: "/auth/signin",
        appPageURL: "/search",

        loginAPIEndpoint: "/api/signin",
        logoutAPIEndpoint: "/api/signout",

        onLoginRequestError: (err) => {
            console.error(err)
        },
        onLogoutRequestError: (err) => {
            console.error(err)
        },

        firebaseAuthEmulatorHost: `localhost:${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT}`,
        firebaseAdminInitConfig: {
            credential: {
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY
            },
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
        },
        firebaseClientInitConfig: firebaseConfig,

        cookies: {
            name: "app",
            keys: [
                process.env.COOKIE_SECRET_CURRENT,
                process.env.COOKIE_SECRET_PREVIOUS
            ],
            httpOnly: true,
            maxAge: 10 * 60 * 60 * 24 * 1000, // 10 days
            overwrite: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NEXT_PUBLIC_COOKIE_SECURE,
            signed: true
        },

        onVerifyTokenError: (err) => {
            console.error(err)
        },
        onTokenRefreshError: (err) => {
            console.error(err)
        }
    })
}

export const auth = getAuth()

export const isUsernameAlreadyInUse = async (username) => {
    return username
        ? get(child(ref(db), `usernames/${username}`)).then((s) => s.exists())
        : false
}

export const logIn = async ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const signUp = async ({ email, password, username }) => {
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
        updateProfile(res.user, { displayName: username })
    })
}

export const logOut = async () => {
    return signOut(auth)
}
