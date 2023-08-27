import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"

import Trash from "./Trash"

export const metadata: Metadata = {
    title: "Trash"
}

export default function TrashPage() {
    return (
        <TransitionOpacity>
            <Trash />
        </TransitionOpacity>
    )
}
