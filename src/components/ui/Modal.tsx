import { motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import { RiCloseLine as CloseIcon } from "react-icons/ri"
import Button from "src/components/ui/Button"
import styled from "styled-components"

import * as Dialog from "@radix-ui/react-dialog"

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
}

export default function Modal(props: ModalProps) {
    const {
        title,
        description,
        triggerElement,
        visible,
        children,
        footer,
        onCancel,
        onConfirm,
        closeButton,
        placement = "center"
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
                    <ModalOverlayContainer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <ModalOverlay />
                    </ModalOverlayContainer>
                </Dialog.Overlay>
                <Dialog.Content>
                    <ModalContainer
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
                        <ModalComponent
                            role="dialog"
                            aria-modal="true"
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                            placement={placement}
                        >
                            <ModalTitle>{title}</ModalTitle>
                            {description && (
                                <ModalDescription>
                                    {description}
                                </ModalDescription>
                            )}
                            <ModalContent>{children}</ModalContent>
                            <ModalFooter>
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
                            </ModalFooter>
                            {!!closeButton && (
                                <CloseButtonContainer>
                                    <Button
                                        onClick={() => {
                                            visible ?? setOpen(false)
                                            onCancel?.()
                                        }}
                                        appearance="text"
                                        icon={<CloseIcon />}
                                    />
                                </CloseButtonContainer>
                            )}
                        </ModalComponent>
                    </ModalContainer>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

const ModalOverlayContainer = styled(motion.div)`
    position: fixed;
    inset: 0;
    z-index: 100;
`

const ModalOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: var(--color-black);
    opacity: 0.5;
`

const ModalContainer = styled(motion.div)`
    position: fixed;
    z-index: 100;
    inset: 0;
    min-height: 100vh;
    display: flex;
    pointer-events: none;
`

const ModalComponent = styled.div<{ placement: "center" | "top" }>`
    display: inline-block;
    background: var(--color-white);
    text-align: left;
    overflow: hidden;
    vertical-align: middle;
    border: 1px solid var(--color-n300);
    border-radius: 0.5rem;
    position: absolute;
    top: ${({ placement }) => (placement === "center" ? "50%" : "10%")};
    left: 50%;
    transform: ${({ placement }) =>
        placement === "center" ? "translate(-50%, -50%)" : "translateX(-50%)"};
    width: 36rem;
    padding: 1.5rem;
    pointer-events: all;
    max-height: 95vh;
    max-width: 95vw;
    overflow: auto;
`

const ModalTitle = styled.h1`
    margin: 0 0 5px 0;
    font-size: 1.25rem;
    font-weight: 600;

    &:empty {
        display: none;
    }
`

const ModalDescription = styled.div`
    font-size: 0.9rem;
    color: var(--color-n700);
    margin-bottom: 20px;
`

const ModalContent = styled.div`
    margin: 10px 0;
`

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 10px;

    &:empty {
        display: none;
    }
`

const CloseButtonContainer = styled.div`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
`
