import { getUser, withPageAuth as _withPageAuth } from '@supabase/auth-helpers-nextjs'

export const withPageAuth = ({ redirectTo = "/auth", ...props } = {}) =>
    _withPageAuth({
        authRequired: true,
        redirectTo,
        ...props
    })

export const withoutPageAuth = ({
    redirectTo = "/home",
    getServerSideProps = async (ctx) => {}
} = {}) =>
    _withPageAuth({
        authRequired: false,
        getServerSideProps: async (ctx) => {
            const res = await getUser(ctx)
            if (res.user) {
                return {
                    redirect: {
                        destination: redirectTo,
                        permanent: false
                    }
                }
            }

            return (await getServerSideProps(ctx)) as any
        }
    })

export { UserProvider, useUser } from "@supabase/auth-helpers-react"
export { supabaseClient, getUser } from "@supabase/auth-helpers-nextjs"

// TEMP
// const useSupabaseUser = () => {
//     const [userInfo, setUserInfo] = useState({
//         user: undefined,
//         claims: {},
//         initialized: false
//     })

//     const [authCookieRequestCompleted, setAuthCookieRequestCompleted] =
//         useState(false)

//     useEffect(() => {
//         console.log("test")
//         const { data: authListener, error } =
//             supabaseClient.auth.onAuthStateChange((event, session) => {
//                 console.log(`Supabase auth state changed. Session: ${session}`)
//             })

//         return () => {
//             authListener.unsubscribe()
//         }
//     }, [])

//     return {
//         ...userInfo,
//         authRequestCompleted: authCookieRequestCompleted
//     }
// }

// export const withAuthUser = () => (ChildComponent) => {
//     const WithAuthUserHOC = ({ user, ...props }) => {
//         const { user: supabaseUser } = useSupabaseUser()
//         console.log(supabaseUser)

//         return (
//             <div>
//                 <ChildComponent {...props} />
//             </div>
//         )
//     }
//     hoistNonReactStatics(WithAuthUserHOC, ChildComponent)
//     return WithAuthUserHOC
// }
