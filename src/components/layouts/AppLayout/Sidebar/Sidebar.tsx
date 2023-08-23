import { useRouter } from "next/router"
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
import Flex from "src/components/Flex"
import Separator from "src/components/Separator"
import Button from "src/components/ui/Button"
import Loader from "src/components/ui/Loader"
import Typography from "src/components/ui/Typography"
import { useAppDispatch, useAppSelector } from "src/store"
import { closeMobileSidebar, openQuicksearch } from "src/store/ui"
import { useUser } from "src/utils/supabase"
import styled, { css } from "styled-components"

import AccountSection from "./components/AccountSection"
import AddFolderButton from "./components/AddFolderButton"
import DocumentsTree from "./components/DocumentsTree"
import SidebarItem from "./components/SidebarItem"

export default function Sidebar() {
    const router = useRouter()
    const user = useUser()

    const [documentsTreeExpanded, setDocumentsTreeExpanded] = useState(true)
    const [favoritesExpanded, setFavoritesExpanded] = useState(true)

    const { sidebarOpen, mobileSidebarOpen } = useAppSelector(
        (store) => store.ui
    )

    const dispatch = useAppDispatch()

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
    }, [router.asPath, dispatch])

    return (
        <>
            <Backdrop
                onClick={() => dispatch(closeMobileSidebar())}
                visible={mobileSidebarOpen}
            />
            <SidebarComponent
                column
                open={sidebarOpen && !!user}
                mobileOpen={mobileSidebarOpen && !!user}
                className="sidebar"
            >
                <AccountSection user={user} />

                <Section>
                    <SidebarItem.Link
                        icon={<HomeIcon />}
                        title="Accueil"
                        href="/home"
                    />
                    <SidebarItem.Link
                        icon={<ShareIcon />}
                        title="Partages"
                        href="/shares"
                    />
                    <SidebarItem.Button
                        icon={<SearchIcon />}
                        title="Rechercher"
                        onClick={() => {
                            dispatch(openQuicksearch())
                        }}
                    />
                </Section>
                <Section
                    style={{
                        flex: "1 1 auto",
                        flexShrink: "initial",
                        overflow: "auto",
                        gap: 10
                    }}
                >
                    {!!favorites?.length && (
                        <Flex column gap={2} style={{ flexShrink: 0 }}>
                            <SectionHeader
                                onClick={() =>
                                    setFavoritesExpanded((prev) => !prev)
                                }
                            >
                                <Flex as="span" align="center" gap={10}>
                                    Favoris
                                    <Count>{favorites?.length}</Count>
                                </Flex>
                                <ExpandButton expanded={favoritesExpanded} />
                            </SectionHeader>
                            <SectionContent expanded={favoritesExpanded}>
                                {favorites.map(({ id, title }) => (
                                    <SidebarItem.Link
                                        key={id}
                                        href={`/doc/${id}`}
                                        icon={<DocumentIcon />}
                                        title={title || "Sans titre"}
                                    />
                                ))}
                            </SectionContent>
                        </Flex>
                    )}

                    <Flex auto column gap={2}>
                        <SectionHeader
                            onClick={() =>
                                setDocumentsTreeExpanded((prev) => !prev)
                            }
                        >
                            <Flex as="span" align="center" gap={10}>
                                Dossiers
                                <Count>
                                    {
                                        folders?.filter((f) => !f.parent_id)
                                            .length
                                    }
                                </Count>
                            </Flex>
                            <ExpandButton expanded={documentsTreeExpanded} />
                        </SectionHeader>
                        <SectionContent expanded={documentsTreeExpanded}>
                            {(isLoadingFolders || isLoadingDocuments) && (
                                <Loader />
                            )}
                            {(foldersError || documentsError) && (
                                <Typography.Text type="danger" small>
                                    Une erreur est survenue. <br />
                                    Voir la console.
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
                        </SectionContent>
                    </Flex>
                </Section>
                <Section>
                    <SidebarItem.Link
                        icon={<TrashIcon />}
                        title="Corbeille"
                        href="/trash"
                    />

                    <SidebarItem.Link
                        icon={<HelpIcon />}
                        title="Aide"
                        href="/help"
                    />
                </Section>
            </SidebarComponent>
        </>
    )
}

const Backdrop = styled.div<{ visible: boolean }>`
    display: none;

    @media (max-width: 768px) {
        display: block;
        position: absolute;
        inset: 0;
        z-index: 25;
        background: var(--color-black);
        pointer-events: none;
        opacity: 0;
        ${({ visible }) =>
            visible &&
            css`
                opacity: 0.75;
                pointer-events: all;
            `}
        transition: all ease-out 0.2s;
    }
`

const SidebarComponent = styled(Flex)<{ open: boolean; mobileOpen: boolean }>`
    position: relative;
    max-height: 100vh;
    width: 300px;
    border-right: 1px solid var(--color-n300);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: auto;

    background-color: var(--color-n75);
    margin-left: ${({ open }) => `${open ? 0 : -300}px`};
    transition: all ease-out 0.25s;
    z-index: 25;

    @media (max-width: 768px) {
        position: absolute;
        top: 0;
        bottom: 0;
        margin-left: 0;
        opacity: ${({ mobileOpen }) => (mobileOpen ? 1 : 0)};
        transform: ${({ mobileOpen }) =>
            mobileOpen ? "translateX(0)" : "translateX(-100%)"};
    }
`

const Section = styled.div`
    display: flex;
    padding: 0.75rem 1rem;
    flex-direction: column;
    flex-shrink: 0;
    gap: 2px;
`

const SectionHeader = styled.h3`
    font-size: 0.85rem;
    font-weight: 400;
    margin: 0 0 5px 0;
    color: var(--color-n600);
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
`

const SectionContent = styled.div<{ expanded?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: ${({ expanded }) => (expanded ? undefined : 0)};
    overflow: ${({ expanded }) => (expanded ? undefined : "hidden")};
`

const Count = styled.span`
    font-size: 0.95em;
    font-weight: 400;
    color: var(--color-n500);
    border-radius: 5px;
`

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
