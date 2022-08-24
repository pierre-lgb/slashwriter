import { useAddFolderMutation } from 'src/services/folders'

import AddOutlined from '@mui/icons-material/AddOutlined'

import SidebarItem from './SidebarItem'

export default function AddFolderButton() {
    const [addFolder] = useAddFolderMutation()

    return (
        <SidebarItem.Button
            title="Nouveau dossier"
            icon={<AddOutlined />}
            onClick={() => {
                const folderName = prompt("Nom du dossier :")
                if (!folderName) return
                addFolder({ name: folderName })
            }}
        />
    )
}
