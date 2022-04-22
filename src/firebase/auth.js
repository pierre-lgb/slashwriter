import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    getAuth,
    signOut,
    fetchSignInMethodsForEmail
} from "firebase/auth";
import { child, get, ref } from "firebase/database";
import { init } from "next-firebase-auth";
import { database as db, firebaseConfig } from ".";

export const initAuth = () => {
    init({
        authPageURL: "/auth/signin",
        appPageURL: "/spaces",

        loginAPIEndpoint: "/api/login",
        logoutAPIEndpoint: "/api/logout",

        onLoginRequestError: (err) => {
            console.error(err);
        },
        onLogoutRequestError: (err) => {
            console.error(err);
        },

        firebaseAuthEmulatorHost: "localhost:9099",
        firebaseAdminInitConfig: {
            credential: {
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY
                    ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
                    : undefined
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
            secure: true,
            signed: true
        },

        onVerifyTokenError: (err) => {
            console.error(err);
        },
        onTokenRefreshError: (err) => {
            console.error(err);
        }
    });
};

export const auth = getAuth();

export const isUsernameAlreadyInUse = async (username) => {
    return username
        ? get(child(ref(db), `usernames/${username}`)).then((s) => s.exists())
        : false;
};

export const logIn = async ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async ({ email, password, username }) => {
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
        updateProfile(res.user, { displayName: username });
    });
};

export const logOut = async () => {
    return signOut(auth);
};
