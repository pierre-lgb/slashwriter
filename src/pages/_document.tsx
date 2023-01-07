import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document"
import { ServerStyleSheet } from "styled-components"

export default function CustomDocument() {
    return (
        <Html lang="fr">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="icon"
                    href="/favicon-light.ico"
                    media="(prefers-color-scheme: dark)"
                />
                <link
                    rel="icon"
                    href="/favicon-light.ico"
                    media="(prefers-color-scheme: light)"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

CustomDocument.getInitialProps = async (ctx: DocumentContext) => {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) =>
                    sheet.collectStyles(<App {...props} />)
            })

        const initialProps = await Document.getInitialProps(ctx)
        return {
            ...initialProps,
            styles: [initialProps.styles, sheet.getStyleElement()]
        }
    } finally {
        sheet.seal()
    }
}
