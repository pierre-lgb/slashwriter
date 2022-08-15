import { motion } from 'framer-motion'

function TransitionOpacity(props) {
    const { children, style, ...otherProps } = props
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 }
            }}
            style={{ width: "100%", height: "100%", ...style }}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export default TransitionOpacity
