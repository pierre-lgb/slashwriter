import { getApp, getApps, initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const database = getDatabase(app);

// if (location.hostname === "localhost") {
connectDatabaseEmulator(database, "localhost", 9000);
connectFunctionsEmulator(getFunctions(app), "localhost", 5001);
// }
