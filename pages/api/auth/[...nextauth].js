import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"

import User from "../../../models/User"

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            authorize: async ({ email, password }) => {
                const user = await User.findOne({ email })
                if (!user) {
                    throw new Error("Aucun utilisateur trouvé.")
                }

                const passwordValid = await compare(password, user.password)
                if (passwordValid) {
                    return {
                        username: user.username,
                        email: user.email
                    }
                } else {
                    throw new Error("Mot de passe incorrect.")
                }
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
            }

            return token
        },
        session: ({ session, token }) => {
            if (token) {
                session.id = token.id
            }

            return session
        }
    },
    secret: process.env.NEXT_AUTH_SECRET,
    jwt: {
        secret: process.env.JWT_SECRET,
        encryption: true
    },
    pages: {
        signIn: '/auth/signin'
    }
})