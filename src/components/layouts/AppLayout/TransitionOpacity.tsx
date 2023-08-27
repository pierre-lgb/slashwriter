"use client"

import { motion } from "framer-motion"

export default function TransitionOpacity(props) {
    const { children, ...otherProps } = props
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 }
            }}
            style={{ width: "100%", height: "100%" }}
            {...otherProps}
        >
            {children}
        </motion.div>
    )
}
