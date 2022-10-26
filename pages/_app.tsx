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
                <link rel="icon" href="/favicon.ico" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
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
