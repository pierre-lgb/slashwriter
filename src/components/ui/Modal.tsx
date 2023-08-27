import { motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import { RiCloseLine as CloseIcon } from "react-icons/ri"
import Button from "src/components/ui/Button"

import * as Dialog from "@radix-ui/react-dialog"

import styles from "./Modal.module.scss"

interface ModalProps {
    title?: string
    description?: string
    triggerElement?: ReactNode
    visible?: boolean
    children?: ReactNode
    footer?: ReactNode
    onCancel?: any
    onConfirm?: any
    closeButton?: any
    placement?: "center" | "top"
    padding?: string
}

export default function Modal(props: ModalProps) {
    const {
        title = "",
        description = "",
        triggerElement,
        visible,
        children,
        footer,
        onCancel,
        onConfirm,
        closeButton,
        placement = "center",
        padding = "1.5rem"
    } = props

    const [open, setOpen] = useState(!!visible)

    useEffect(() => {
        setOpen(!!visible)
    }, [visible])

    function handleOpenChange(open: boolean) {
        if (visible !== undefined && !open) {
            onCancel?.()
        } else {
            setOpen(open)
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            {triggerElement && (
                <Dialog.Trigger asChild>{triggerElement}</Dialog.Trigger>
            )}
            <Dialog.Portal>
                <Dialog.Overlay>
                    <motion.div
                        className={styles.modalOverlayContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className={styles.modalOverlay} />
                    </motion.div>
                </Dialog.Overlay>
                <Dialog.Content>
                    <motion.div
                        className={styles.modalContainer}
                        onClick={() => {
                            onCancel?.()
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: {
                                scale: 0.9,
                                opacity: 0
                            },
                            visible: {
                                scale: 1,
                                opacity: 1,
                                transition: {
                                    duration: 2,
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 300,
                                    delay: 0.2
                                }
                            }
                        }}
                    >
                        <div
                            className={`${styles.modal} ${
                                styles[`${placement}Placement`]
                            }`}
                            role="dialog"
                            aria-modal="true"
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                            style={{ padding }}
                        >
                            <h1 className={styles.modalTitle}>{title}</h1>
                            <div className={styles.modalDescription}>
                                {description}
                            </div>

                            <div className={styles.modalContent}>
                                {children}
                            </div>

                            <div className={styles.modalFooter}>
                                {footer !== undefined ? (
                                    footer
                                ) : (
                                    <>
                                        <Button
                                            appearance="secondary"
                                            onClick={() => {
                                                visible ?? setOpen(false)
                                                onCancel?.()
                                            }}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                visible ?? setOpen(false)
                                                onConfirm?.()
                                            }}
                                        >
                                            Valider
                                        </Button>
                                    </>
                                )}
                            </div>
                            {!!closeButton && (
                                <div className={styles.closeButtonContainer}>
                                    <Button
                                        onClick={() => {
                                            visible ?? setOpen(false)
                                            onCancel?.()
                                        }}
                                        appearance="text"
                                        icon={<CloseIcon />}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
