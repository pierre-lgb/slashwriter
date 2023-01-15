import { RiAddLine as AddIcon } from "react-icons/ri"
import * as foldersApi from "src/api/folders"
import { useAppDispatch } from "src/store"

import SidebarItem from "./SidebarItem"

export default function AddFolderButton() {
    const dispatch = useAppDispatch()

    return (
        <SidebarItem.Button
            title="Nouveau dossier"
            icon={<AddIcon />}
            onClick={() => {
                const folderName = prompt("Nom du dossier :")
                if (!folderName) return
                dispatch(foldersApi.insertFolder({ name: folderName }))
            }}
        />
    )
}
