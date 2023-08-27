"use client"

import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
    RiArrowDownSLine as ExpandDownIcon,
    RiDeleteBin7Line as TrashIcon,
    RiFileTextLine as DocumentIcon,
    RiHome4Line as HomeIcon,
    RiQuestionLine as HelpIcon,
    RiSearchLine as SearchIcon,
    RiShareForwardLine as ShareIcon
} from "react-icons/ri"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Button from "src/components/ui/Button"
import Flex from "src/components/ui/Flex"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useAppDispatch, useAppSelector } from "src/store"
import { closeMobileSidebar, openQuicksearch } from "src/store/ui"

import AccountSection from "./AccountSection"
import AddFolderButton from "./AddFolderButton"
import DocumentsTree from "./DocumentsTree"
import styles from "./Sidebar.module.scss"
import SidebarItem from "./SidebarItem"

export default function Sidebar() {
    const { session } = useSupabase()
    const pathname = usePathname()

    const [documentsTreeExpanded, setDocumentsTreeExpanded] = useState(true)
    const [favoritesExpanded, setFavoritesExpanded] = useState(true)

    const dispatch = useAppDispatch()
    const { sidebarOpen, mobileSidebarOpen } = useAppSelector(
        (store) => store.ui
    )

    const {
        folders,
        isLoading: isLoadingFolders,
        error: foldersError
    } = useAppSelector((store) => store.folders)

    const {
        documents,
        isLoading: isLoadingDocuments,
        error: documentsError
    } = useAppSelector((store) => store.documents)

    useEffect(() => {
        if (foldersError) {
            console.error(foldersError)
        }
        if (documentsError) {
            console.error(documentsError)
        }
    }, [foldersError, documentsError])

    const favorites = useMemo(
        () => documents?.filter((d) => d.favorite),
        [documents]
    )

    useEffect(() => {
        dispatch(closeMobileSidebar())
    }, [pathname, dispatch])

    return (
        <>
            <div
                onClick={() => dispatch(closeMobileSidebar())}
                className={`${styles.backdrop} ${
                    mobileSidebarOpen ? styles.visible : ""
                }`}
            ></div>
            <div
                className={`${styles.sidebar} ${
                    sidebarOpen && session ? styles.open : ""
                } ${mobileSidebarOpen && session ? styles.mobileOpen : ""}`}
            >
                <AccountSection user={session?.user} />

                <div className={styles.section}>
                    <SidebarItem.Link
                        icon={<HomeIcon />}
                        title="Home"
                        href="/home"
                    />
                    <SidebarItem.Link
                        icon={<ShareIcon />}
                        title="Shares"
                        href="/shares"
                    />
                    <SidebarItem.Button
                        icon={<SearchIcon />}
                        title="Search"
                        onClick={() => {
                            dispatch(openQuicksearch())
                        }}
                    />
                </div>
                <div
                    className={styles.section}
                    style={{
                        flex: "1 1 auto",
                        flexShrink: "initial",
                        overflow: "auto",
                        gap: 10
                    }}
                >
                    {!!favorites?.length && (
                        <Flex column gap={2} style={{ flexShrink: 0 }}>
                            <div
                                className={styles.sectionHeader}
                                onClick={() =>
                                    setFavoritesExpanded((prev) => !prev)
                                }
                            >
                                <Flex align="center" gap={10}>
                                    <span>Favorites</span>
                                    <div className={styles.count}>
                                        {favorites?.length}
                                    </div>
                                </Flex>
                                <ExpandButton expanded={favoritesExpanded} />
                            </div>
                            <div
                                className={`${styles.sectionContent} ${
                                    favoritesExpanded ? styles.expanded : ""
                                }`}
                            >
                                {favorites.map(({ id, title }) => (
                                    <SidebarItem.Link
                                        key={id}
                                        href={`/doc/${id}`}
                                        icon={<DocumentIcon />}
                                        title={title || "Sans titre"}
                                    />
                                ))}
                            </div>
                        </Flex>
                    )}

                    <Flex auto column gap={2}>
                        <div
                            className={styles.sectionHeader}
                            onClick={() =>
                                setDocumentsTreeExpanded((prev) => !prev)
                            }
                        >
                            <Flex align="center" gap={10}>
                                <span>Folders</span>
                                <div className={styles.count}>
                                    {
                                        folders?.filter((f) => !f.parent_id)
                                            .length
                                    }
                                </div>
                                {(isLoadingFolders || isLoadingDocuments) && (
                                    <Loader />
                                )}
                            </Flex>
                            <ExpandButton expanded={documentsTreeExpanded} />
                        </div>
                        <div
                            className={`${styles.sectionContent} ${
                                documentsTreeExpanded ? styles.expanded : ""
                            }`}
                        >
                            {(foldersError || documentsError) && (
                                <Typography.Text type="danger" small>
                                    Une erreur est survenue. Voir la console.
                                </Typography.Text>
                            )}
                            {folders && documents && (
                                <>
                                    <DocumentsTree
                                        folders={folders}
                                        documents={documents}
                                    />
                                    <AddFolderButton />
                                </>
                            )}
                        </div>
                    </Flex>
                </div>
                <div className={styles.section}>
                    <SidebarItem.Link
                        icon={<TrashIcon />}
                        title="Trash"
                        href="/trash"
                    />

                    <SidebarItem.Link
                        icon={<HelpIcon />}
                        title="Help"
                        href="/help"
                    />
                </div>
            </div>
        </>
    )
}

const ExpandButton = ({ expanded }) => (
    <Button
        appearance="text"
        size="medium"
        style={{ padding: "2px" }}
        icon={
            <ExpandDownIcon
                style={{
                    transform: expanded ? "rotateZ(0deg)" : "rotateZ(-90deg)",
                    transition: "0.3s"
                }}
            />
        }
    />
)
