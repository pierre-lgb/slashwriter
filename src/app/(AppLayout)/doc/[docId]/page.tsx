import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"

import Document from "./Document"

export const metadata: Metadata = {
    title: "Document | Slashwriter"
}

export default function DocumentPage() {
    return (
        <TransitionOpacity>
            <Document />
        </TransitionOpacity>
    )
}
