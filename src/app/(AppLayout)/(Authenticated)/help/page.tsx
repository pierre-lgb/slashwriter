import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"

import Help from "./Help"

export const metadata: Metadata = {
    title: "Trash"
}

export default function HelpPage() {
    return (
        <TransitionOpacity>
            <Help />
        </TransitionOpacity>
    )
}
