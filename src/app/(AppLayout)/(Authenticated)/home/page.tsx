import { Metadata } from "next"
import TransitionOpacity from "src/components/layouts/AppLayout/TransitionOpacity"
import Typography from "src/components/ui/Typography"

import Home from "./Home"

export const metadata: Metadata = {
    title: "Home",
    description: "Explore your recent folders and documents."
}

export default function HomePage() {
    return (
        <TransitionOpacity>
            <Home />
        </TransitionOpacity>
    )
}
