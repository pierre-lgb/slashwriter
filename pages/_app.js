import { SessionProvider } from "next-auth/react"
import '../styles/global/globals.css'
import '../styles/global/colors.css'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
