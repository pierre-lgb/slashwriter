"use client"

import { useParams, useRouter } from "next/navigation"
import {
    RiHeartFill as FavoriteFillIcon,
    RiHeartLine as FavoriteIcon,
    RiMoreFill as MoreIcon,
    RiSideBarLine as SidebarIcon,
    RiUserLine as UserIcon
} from "react-icons/ri"
import { documentsApi } from "src/api"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Button from "src/components/ui/Button"
import Flex from "src/components/ui/Flex"
import { useAppDispatch, useAppSelector } from "src/store"
import { toggleMobileSidebar, toggleSidebar } from "src/store/ui"

import styles from "./Header.module.scss"
import HeaderBreadcrumbs from "./HeaderBreadcrumbs"
import ShareDocumentButton from "./ShareDocumentButton"

export default function Header() {
    const { docId, folderId } = useParams()
    const router = useRouter()

    const { session } = useSupabase()

    const dispatch = useAppDispatch()

    const activeDocument = useAppSelector((state) =>
        docId ? state.documents.documents.find((d) => d.id === docId) : null
    )

    const activeFolder = useAppSelector((state) =>
        folderId
            ? state.folders.folders.find((f) => f.id === folderId)
            : docId
            ? state.documents.documents.find((d) => d.id === docId)?.folder_id
            : null
    )

    return (
        <div className={styles.header}>
            <Flex auto align="center" gap={20}>
                {!!session && (
                    <>
                        <div className={styles.toggleSidebarButtonContainer}>
                            <Button
                                onClick={() => {
                                    dispatch(toggleSidebar())
                                }}
                                appearance="text"
                                icon={<SidebarIcon size={20} />}
                            />
                        </div>
                        <div
                            className={
                                styles.mobileToggleSidebarButtonContainer
                            }
                        >
                            <Button
                                onClick={() => {
                                    dispatch(toggleMobileSidebar())
                                }}
                                appearance="secondary"
                                icon={<SidebarIcon />}
                            />
                        </div>
                    </>
                )}
                <HeaderBreadcrumbs
                    activeDocument={activeDocument}
                    activeFolder={activeFolder}
                />
            </Flex>
            <Flex
                align="center"
                gap={8}
                style={{ justifySelf: "flex-end", flexShrink: 0 }}
            >
                {!session && (
                    <Button
                        appearance="secondary"
                        onClick={() => router.push("/auth/sign-in")}
                        icon={<UserIcon />}
                    >
                        Sign In
                    </Button>
                )}
                {!!activeDocument && (
                    <>
                        <Button
                            appearance="secondary"
                            icon={
                                activeDocument?.favorite ? (
                                    <FavoriteFillIcon />
                                ) : (
                                    <FavoriteIcon />
                                )
                            }
                            onClick={() => {
                                dispatch(
                                    documentsApi.updateDocument({
                                        id: docId as string,
                                        favorite: !activeDocument.favorite
                                    })
                                )
                            }}
                        />
                        <ShareDocumentButton documentId={docId as string}>
                            Share
                        </ShareDocumentButton>
                    </>
                )}
                {(!!activeDocument || !!activeFolder) && (
                    <>
                        <div className={styles.verticalSeparator} />
                        <Button appearance="text" icon={<MoreIcon />} />
                    </>
                )}
            </Flex>
        </div>
    )
}
