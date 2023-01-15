import { RiFolder3Line as FolderIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import { useAppSelector } from "src/store"
import styled from "styled-components"

import SidebarItem from "./SidebarItem"

interface DocumentsTreeProps {
    folders: any[]
    documents: any[]
}

export default function DocumentsTree(props: DocumentsTreeProps) {
    return (
        <>
            {props.folders
                .filter((folder) => !folder.parent_id)
                .map(({ id, name }) => (
                    <SidebarItem.Link
                        key={id}
                        href={`/folder/${id}`}
                        icon={<FolderIcon />}
                        title={name}
                    />
                ))}
        </>
    )
}
