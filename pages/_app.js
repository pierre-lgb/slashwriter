import { SessionProvider } from "next-auth/react"
import '../styles/globals.css'
import '../styles/forms.css'
import '../styles/colors.css'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
