import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"

import Settings from "./Settings"

export const metadata: Metadata = {
    title: "Settings"
}

export default function SettingsPage() {
    return (
        <TransitionOpacity>
            <Settings />
        </TransitionOpacity>
    )
}
