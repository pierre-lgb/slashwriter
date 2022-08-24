import { motion } from 'framer-motion'

function TransitionOpacity(props) {
    const { children, ...otherProps } = props
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 }
            }}
            {...otherProps}
        >
            {children}
        </motion.div>
    )
}

export default TransitionOpacity
