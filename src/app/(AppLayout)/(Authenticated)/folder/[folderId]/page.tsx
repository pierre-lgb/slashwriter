import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"

import Folder from "./Folder"

export const metadata: Metadata = {
    title: "Dossier | Slashwriter"
}

export default function FolderPage() {
    return (
        <TransitionOpacity>
            <Folder />
        </TransitionOpacity>
    )
}
