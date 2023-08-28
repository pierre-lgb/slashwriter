import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { RiGithubFill } from "react-icons/ri"
import Button from "src/components/ui/Button"
import Flex from "src/components/ui/Flex"
import Typography from "src/components/ui/Typography"

import styles from "./Index.module.scss"

export const metadata: Metadata = {
    title: "Slashwriter"
}

export default function IndexPage() {
    return (
        <>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Image
                        src="/assets/logoFull.svg"
                        width={180}
                        height={50}
                        alt="logo"
                        id="logo"
                    />
                    <nav>
                        <Link href="/doc/6f624515-3533-4312-9ba0-cf310a0e6a42">
                            Demo
                        </Link>
                        <Link href="/auth/sign-in">Sign In</Link>
                    </nav>
                </header>
                <div className={styles.hero}>
                    <Typography.Title
                        level={1}
                        style={{ textAlign: "center", maxWidth: 500 }}
                    >
                        Easy and Classy
                        <br />
                        Note-Taking
                    </Typography.Title>
                    <Typography.Text
                        style={{
                            fontSize: "1.2rem",
                            maxWidth: 300,
                            textAlign: "center"
                        }}
                    >
                        Create, organize, and share your notes with Slashwriter.
                    </Typography.Text>
                    <Flex
                        gap={10}
                        style={{ flexWrap: "wrap", justifyContent: "center" }}
                    >
                        <Link
                            target="_blank"
                            href="/doc/6f624515-3533-4312-9ba0-cf310a0e6a42"
                        >
                            <Button size="large">Try the demo</Button>
                        </Link>
                        <Link
                            target="_blank"
                            href="https://github.com/pierre-lgb/slashwriter"
                        >
                            <Button
                                appearance="secondary"
                                size="large"
                                icon={<RiGithubFill />}
                            >
                                Source code
                            </Button>
                        </Link>
                    </Flex>

                    <img
                        src="/assets/slashwriter-mockup.png"
                        alt="cover"
                        className={styles.cover}
                    />
                </div>
                <div className={styles.featureList}>
                    <div className={styles.feature}>
                        <div
                            className={styles.featureImage}
                            style={{
                                backgroundImage:
                                    "url(/assets/slashwriter-commands-preview.gif)"
                            }}
                        ></div>
                        <div className={styles.featureDescription}>
                            <Typography.Title level={3}>
                                Slash commands
                            </Typography.Title>
                            <Typography.Text>
                                By typing{" "}
                                <Typography.Text code small>
                                    /
                                </Typography.Text>{" "}
                                in the editor, a list of commands appears to
                                quickly add headings, images, tables, and more,
                                without having to search through menus.
                            </Typography.Text>
                        </div>
                    </div>
                    <div className={`${styles.feature} ${styles.reverse}`}>
                        <div
                            className={styles.featureImage}
                            style={{
                                backgroundImage:
                                    "url(/assets/slashwriter-collaboration-preview.gif)"
                            }}
                        ></div>
                        <div className={styles.featureDescription}>
                            <Typography.Title level={3}>
                                Collaborative Editor
                            </Typography.Title>
                            <Typography.Text>
                                Slashwriter allows collaborative work on
                                documents in real time. You can invite other
                                users to edit or comment on your document, and
                                see their changes in real time.
                            </Typography.Text>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <div
                            className={styles.featureImage}
                            style={{
                                backgroundImage:
                                    "url(/assets/slashwriter-subpages-preview.gif)"
                            }}
                        ></div>
                        <div className={styles.featureDescription}>
                            <Typography.Title level={3}>
                                Subdocuments
                            </Typography.Title>
                            <Typography.Text>
                                Slashwriter allows you to organize your
                                documents using integrated subdocuments. This
                                makes navigation and reading easier, avoiding
                                the need to scroll through a long and complex
                                document.
                            </Typography.Text>
                        </div>
                    </div>
                    <div className={`${styles.feature} ${styles.reverse}`}>
                        <div
                            className={styles.featureImage}
                            style={{
                                backgroundImage:
                                    "url(/assets/slashwriter-equations-preview.gif)"
                            }}
                        ></div>
                        <div className={styles.featureDescription}>
                            <Typography.Title level={3}>
                                Equations
                            </Typography.Title>
                            <Typography.Text>
                                Slashwriter supports mathematical equations. You
                                can easily add equations using LaTeX syntax,
                                which allows you to create higher-quality
                                documents.
                            </Typography.Text>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <div
                            className={styles.featureImage}
                            style={{
                                backgroundImage:
                                    "url(/assets/slashwriter-tables-preview.gif)"
                            }}
                        ></div>
                        <div className={styles.featureDescription}>
                            <Typography.Title level={3}>
                                Tables
                            </Typography.Title>
                            <Typography.Text>
                                Slashwriter also allows you to create and edit
                                tables with a simple structure. You can easily
                                modify colors, add rows and columns, and more.
                            </Typography.Text>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <Typography.Text style={{ color: "#9C9C9C" }}>
                        Slashwriter. Developed by Pierre L.
                    </Typography.Text>
                    <Typography.Link
                        target="_blank"
                        href="https://github.com/pierre-lgb/slashwriter"
                    >
                        Source code (Github)
                    </Typography.Link>
                </div>
            </div>
        </>
    )
}
