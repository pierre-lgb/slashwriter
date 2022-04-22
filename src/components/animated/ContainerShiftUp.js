import { motion } from "framer-motion";

const ContainerShiftUp = ({ children, delay = 0, ...props }) => {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: {
                    y: 20,
                    opacity: 0
                },
                show: {
                    y: 0,
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

export default ContainerShiftUp;
