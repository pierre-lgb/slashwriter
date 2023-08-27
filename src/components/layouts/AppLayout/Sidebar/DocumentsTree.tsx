import { RiFolder2Line as FolderIcon } from "react-icons/ri"

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
