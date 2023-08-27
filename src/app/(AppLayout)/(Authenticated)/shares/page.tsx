import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"

import Shares from "./Shares"

export const metadata: Metadata = {
    title: "Partages"
}

export default function SharesPage() {
    return (
        <TransitionOpacity>
            <Shares />
        </TransitionOpacity>
    )
}
