import { GetServerSidePropsContext } from "next"

import {
    createBrowserSupabaseClient,
    createServerSupabaseClient
} from "@supabase/auth-helpers-nextjs"

export const withPageAuth =
    (props?: { redirectTo: string }) =>
    async (ctx: GetServerSidePropsContext) => {
        const { redirectTo = "/auth" } = props || {}
        const supabase = createServerSupabaseClient(ctx)

        const {
            data: { session }
        } = await supabase.auth.getSession()

        if (!session) {
            return {
                redirect: {
                    destination: redirectTo,
                    permanent: false
                }
            }
        }

        return {
            props: {
                initialSession: session,
                user: session.user
            }
        }
    }

export const withoutPageAuth =
    (props?: { redirectTo: string; getServerSideProps: Function }) =>
    async (ctx: GetServerSidePropsContext) => {
        const {
            redirectTo = "/home",
            getServerSideProps = () => ({ props: {} })
        } = props || {}
        const supabase = createServerSupabaseClient(ctx)

        const {
            data: { session }
        } = await supabase.auth.getSession()

        if (session) {
            return {
                redirect: {
                    destination: redirectTo,
                    permanent: false
                }
            }
        }

        return getServerSideProps(ctx)
    }

export const supabaseClient = createBrowserSupabaseClient()

// export const withPageAuth = ({ redirectTo = "/auth", ...props } = {}) =>
//     _withPageAuth({
//         authRequired: true,
//         redirectTo,
//         ...props
//     })

// export const withoutPageAuth = ({
//     redirectTo = "/home",
//     getServerSideProps = async (ctx) => {}
// } = {}) =>
//     _withPageAuth({
//         authRequired: false,
//         getServerSideProps: async (ctx) => {
//             const res = await getUser(ctx)
//             if (res.user) {
//                 return {
//                     redirect: {
//                         destination: redirectTo,
//                         permanent: false
//                     }
//                 }
//             }

//             return (await getServerSideProps(ctx)) as any
//         }
//     })

// export const signOut = () => {
//     supabaseClient.auth.signOut()
//     store.dispatch(api.util.resetApiState())
// }

export { useUser } from "@supabase/auth-helpers-react"
