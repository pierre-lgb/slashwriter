import styled from "styled-components"
import twemoji from "twemoji"

export default function Emoji({ emoji, ...props }) {
    return (
        <StyledSpan
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

const StyledSpan = styled.span`
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    animation: fade-in 0.2s;

    & > img {
        width: 100%;
    }
`
