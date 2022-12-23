import Head from "next/head"
import { useEffect } from "react"
import { Provider as StoreProvider } from "react-redux"
import GlobalStyle from "src/components/GlobalStyle"
import store from "src/store"
import { supabaseClient, UserProvider } from "src/utils/supabase"

function App({ Component, pageProps }) {
    const Layout = Component.Layout || (({ children }) => <>{children}</>)
    const pageTitle = Component.Title
        ? `${Component.Title} | Slashwriter`
        : "Slashwriter"

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    name="description"
                    content="Créez, organisez et partagez vos documents."
                />
            </Head>
            <GlobalStyle />
            <UserProvider supabaseClient={supabaseClient}>
                <StoreProvider store={store}>
                    <Layout title={Component.Title} icon={Component.Icon}>
                        <Component {...pageProps} />
                    </Layout>
                </StoreProvider>
            </UserProvider>
        </>
    )
}

export default App
