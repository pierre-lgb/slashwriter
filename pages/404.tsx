import Image from "next/image"
import Link from "next/link"
import Flex from "src/components/Flex"
import Typography from "src/components/ui/Typography"
import styled from "styled-components"

function Error404() {
    return (
        <Container align="center" justify="center" column>
            <Image src="/assets/404.svg" width={500} height={200} alt="404" />
            <Typography.Title level={3}>Page introuvable</Typography.Title>
            <Link href="/" passHref legacyBehavior>
                <Typography.Link>Retourner à l'accueil</Typography.Link>
            </Link>
        </Container>
    )
}

const Container = styled(Flex)`
    h2 {
        font-size: 1.5em;
    }
`

Error404.Title = "404"

export default Error404
