import { motion } from "framer-motion";

const ContainerOpacity = ({ children, delay = 0, ...props }) => {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: {
                    opacity: 0
                },
                show: {
                    opacity: 1,
                    transition: { delay }
                }
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default ContainerOpacity;
