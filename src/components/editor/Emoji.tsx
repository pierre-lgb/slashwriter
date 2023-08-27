import twemoji from "twemoji"

import styles from "./Emoji.module.scss"

export default function Emoji({ emoji, ...props }) {
    return (
        <span
            className={styles.emoji}
            dangerouslySetInnerHTML={{
                __html: twemoji.parse(emoji, {
                    folder: "svg",
                    ext: ".svg",
                    //  https://github.com/twitter/twemoji/issues/580
                    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
                })
            }}
            {...props}
        />
    )
}
