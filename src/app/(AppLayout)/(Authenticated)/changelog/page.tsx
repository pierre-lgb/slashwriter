import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"

import Changelog from "./Changelog"

export const metadata: Metadata = {
    title: "Changelog"
}

export default function ChangelogPage() {
    return (
        <TransitionOpacity>
            <Changelog />
        </TransitionOpacity>
    )
}
