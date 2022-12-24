import { MdOutlineFolderOpen as FolderIcon } from "react-icons/md"
import Flex from "src/components/Flex"
import { useAppSelector } from "src/store"
import styled from "styled-components"

import SidebarItem from "./SidebarItem"

interface OutlinerProps {
    folders: any[]
    documents: any[]
}

export default function Outliner(props: OutlinerProps) {
    const { activeFolder } = useAppSelector((store) => store.navigation)

    return (
        <>
            <Flex
                justify="space-between"
                align="center"
                style={{ marginBottom: 5 }}
            >
                <Title>Dossiers</Title>
                <Badge>{props.folders.length}</Badge>
            </Flex>
            {props.folders.map(({ id, name }) => (
                <SidebarItem.Link
                    key={id}
                    href={`/folder/${id}`}
                    icon={<FolderIcon />}
                    title={name}
                    active={id === activeFolder}
                />
            ))}
        </>
    )
}

const Title = styled.h3`
    font-size: 0.9em;
    font-weight: 600;
    margin: 0;
    color: var(--color-n500);
`

const Badge = styled.span`
    background-color: var(--color-n100);
    padding: 5px;
    font-size: 0.8em;
    font-weight: 600;
    color: var(--color-n700);
    border-radius: 5px;
`
