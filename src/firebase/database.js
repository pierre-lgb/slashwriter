import { getDatabase, connectDatabaseEmulator } from "firebase/database"
import { app } from "."

export const database = getDatabase(app)

connectDatabaseEmulator(
    database,
    "localhost",
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_EMULATOR_PORT
)
