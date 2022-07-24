import "../styles/global/globals.css"
import "../styles/global/colors.css"
import { initAuth } from "../firebase/auth"
import { AuthAction, withAuthUser } from "next-firebase-auth"

initAuth()

function App({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page)

    return getLayout(<Component {...pageProps} />)
}

export default withAuthUser()(App)
