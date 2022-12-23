import Head from "next/head"
import { Provider as StoreProvider } from "react-redux"
import GlobalStyle from "src/components/GlobalStyle"
import store from "src/store"
import { supabaseClient } from "src/utils/supabase"

import { SessionContextProvider } from "@supabase/auth-helpers-react"

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
            <SessionContextProvider
                supabaseClient={supabaseClient}
                initialSession={pageProps.initialSession}
            >
                <StoreProvider store={store}>
                    <Layout title={Component.Title} icon={Component.Icon}>
                        <Component {...pageProps} />
                    </Layout>
                </StoreProvider>
            </SessionContextProvider>
        </>
    )
}

export default App
