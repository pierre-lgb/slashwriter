import { RiAddLine as AddIcon } from "react-icons/ri"
import { useAddFolderMutation } from "src/services/folders"

import SidebarItem from "./SidebarItem"

export default function AddFolderButton() {
    const [addFolder] = useAddFolderMutation()

    return (
        <SidebarItem.Button
            title="Nouveau dossier"
            icon={<AddIcon />}
            onClick={() => {
                const folderName = prompt("Nom du dossier :")
                if (!folderName) return
                addFolder({ name: folderName })
            }}
        />
    )
}
