import 'src/styles/globals.css'

import Head from 'next/head'
import { Provider as StoreProvider } from 'react-redux'
import store from 'src/store'
import { supabaseClient, UserProvider } from 'src/utils/supabase'

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
            </Head>
            <UserProvider supabaseClient={supabaseClient}>
                <StoreProvider store={store}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </StoreProvider>
            </UserProvider>
        </>
    )
}

export default App
