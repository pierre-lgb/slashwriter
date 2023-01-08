import { RiFolder3Line as FolderIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import { useAppSelector } from "src/store"
import styled from "styled-components"

import SidebarItem from "./SidebarItem"

interface OutlinerProps {
    folders: any[]
    documents: any[]
}

export default function Outliner(props: OutlinerProps) {
    const { activeFolderId } = useAppSelector((store) => store.navigation)

    return (
        <>
            {props.folders.map(({ id, name }) => (
                <SidebarItem.Link
                    key={id}
                    href={`/folder/${id}`}
                    icon={<FolderIcon />}
                    title={name}
                    active={id === activeFolderId}
                />
            ))}
        </>
    )
}

const Badge = styled.span`
    background-color: var(--color-n100);
    padding: 5px;
    font-size: 0.8em;
    font-weight: 600;
    color: var(--color-n700);
    border-radius: 5px;
    font-family: "JetBrains Mono", monospace;
`

const Title = styled.h3`
    font-size: 0.9em;
    font-weight: 500;
    margin: 0;
    color: var(--color-n500);
`
