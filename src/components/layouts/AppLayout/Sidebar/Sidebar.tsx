import Flex from 'src/components/Flex'
import { useGetDocumentsQuery } from 'src/services/documents'
import { useGetFoldersQuery } from 'src/services/folders'
import { useUser } from 'src/utils/supabase'
import styled from 'styled-components'

import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'

import AccountSection from './components/AccountSection'
import AddFolderButton from './components/AddFolderButton'
import Outliner from './components/Outliner'
import SidebarItem from './components/SidebarItem'

export default function Sidebar() {
    const { user } = useUser()

    const {
        data: folders,
        error: foldersError,
        isLoading: isLoadingFolders
    } = useGetFoldersQuery(null, { skip: !user })

    const {
        data: documents,
        error: documentsError,
        isLoading: isLoadingDocuments
    } = useGetDocumentsQuery(null, { skip: !user })

    return (
        <Container column>
            <AccountSection user={user} />
            <Section gap={5}>
                <SidebarItem.Link
                    icon={<HomeOutlined />}
                    title="Accueil"
                    href="/home"
                />
                <SidebarItem.Link
                    icon={<StarBorderOutlined />}
                    title="Favoris"
                    href="/favorites"
                />
                <SidebarItem.Link
                    icon={<TuneOutlined />}
                    title="Paramètres"
                    href="/settings"
                />
            </Section>
            <Divider />
            <Section gap={5} auto>
                {(isLoadingFolders || isLoadingDocuments) && (
                    <span>Chargement...</span>
                )}
                {(foldersError || documentsError) && (
                    <span>Une erreur est survenue. Voir la console.</span>
                )}
                {folders && documents && (
                    <Outliner folders={folders} documents={documents} />
                )}
                <AddFolderButton />
            </Section>
            <Divider />
            <Section gap={5}>
                <SidebarItem.Link
                    icon={<DeleteOutlined />}
                    title="Corbeille"
                    href="/trash"
                />
                <SidebarItem.Link
                    icon={<HelpOutlineOutlined />}
                    title="Aide"
                    href="/help"
                />
            </Section>
        </Container>
    )
}

const Container = styled(Flex)`
    border-right: 1px solid var(--color-n300);
    flex-shrink: 0;
    width: 300px;
`

const Section = styled(Flex)`
    margin: 16px 20px;
    flex-direction: column;
`

const Divider = styled.hr`
    margin: 0 16px;
    border-width: 0 0 thin;
    border-style: solid;
    border-color: var(--color-n300);
`
