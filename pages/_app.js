import "../styles/global/globals.css";
import "../styles/global/colors.css";
import { initAuth } from "../src/firebase/auth";

initAuth();

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
