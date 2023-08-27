import Image from "next/legacy/image"
import Link from "next/link"
import Flex from "src/components/ui/Flex"
import Typography from "src/components/ui/Typography"

function NotFound() {
    return (
        <Flex
            align="center"
            justify="center"
            column
            style={{ height: "100vh" }}
        >
            <Image
                src="/assets/404.svg"
                width={500}
                height={200}
                alt="404"
                priority
            />
            <Typography.Title level={3}>Page not found</Typography.Title>
            <Link href="/home" legacyBehavior>
                <Typography.Link>Return Home</Typography.Link>
            </Link>
        </Flex>
    )
}

export default NotFound
