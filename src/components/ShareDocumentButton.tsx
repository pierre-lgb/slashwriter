import { ReactNode, useEffect, useState } from "react"
import { RiLinkM as LinkIcon, RiShareLine as ShareIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import Button from "src/components/ui/Button"
import Input from "src/components/ui/Input"
import Modal from "src/components/ui/Modal"
import Select from "src/components/ui/Select"
import { useGetDocumentsQuery } from "src/services/documents"
import { supabaseClient } from "src/utils/supabase"
import styled from "styled-components"

import Typography from "./ui/Typography"

interface ShareDocumentButtonProps {
    documentId: string
    children?: ReactNode
}

export default function ShareDocumentButton(props: ShareDocumentButtonProps) {
    const { documentId, children } = props

    const [modalVisible, setModalVisible] = useState(false)
    const [existingShareSettings, setExistingShareSettings] = useState(null)
    const [inherited, setInherited] = useState(false)
    const [anyonePermission, setAnyonePermission] = useState("none")

    const { documentInheritedFrom } = useGetDocumentsQuery(null, {
        selectFromResult: ({ data }) => ({
            documentInheritedFrom: data?.find(
                (d) => d.id === existingShareSettings.document_id
            )
        }),
        skip: !existingShareSettings || !inherited
    })

    useEffect(() => {
        if (modalVisible) {
            // Fetch the share settings when the modal is opened
            supabaseClient
                .from("documents")
                .select("share_settings (*)")
                .eq("id", documentId)
                .single()
                .then(({ data }) => {
                    const { share_settings } = data
                    if (share_settings) {
                        setExistingShareSettings(share_settings)
                        setInherited(documentId !== share_settings.document_id)
                        setAnyonePermission(
                            (share_settings.anyone_can_edit && "edit") ||
                                (share_settings.anyone_can_read && "read") ||
                                "none"
                        )
                    }
                })
        }
    }, [modalVisible, documentId])

    async function handleSubmit() {
        const settings = {
            anyone_can_read:
                anyonePermission === "read" || anyonePermission === "edit",
            anyone_can_edit: anyonePermission === "edit"
        }

        const disabledInheritance =
            (existingShareSettings?.document_id === documentId) === inherited

        if (existingShareSettings && !disabledInheritance) {
            await supabaseClient
                .from("shares")
                .update(settings)
                .match({ id: existingShareSettings.id })
        } else {
            await supabaseClient
                .from("shares")
                .insert({ document_id: documentId, ...settings })
        }
    }

    return (
        <Modal
            title="Partager"
            description="Choisissez qui peut accéder à votre document."
            triggerElement={
                <Button
                    size="medium"
                    appearance="secondary"
                    icon={<ShareIcon />}
                    onClick={() => setModalVisible(true)}
                >
                    {children}
                </Button>
            }
            visible={modalVisible}
            onConfirm={() => {
                handleSubmit()
                setModalVisible(false)
            }}
            onCancel={() => setModalVisible(false)}
            closeButton
        >
            <ModalContent column align="center" gap={20}>
                {inherited ? (
                    <>
                        <Typography.Text>
                            Les paramètres de partage de ce document sont
                            hérités du document{" "}
                            <Typography.Link
                                href={`/doc/${existingShareSettings?.document_id}`}
                            >
                                {documentInheritedFrom?.title || "Sans titre"}
                            </Typography.Link>
                            .{" "}
                            <Button
                                danger
                                appearance="secondary"
                                size="small"
                                onClick={() => setInherited(false)}
                            >
                                Dissocier
                            </Button>
                        </Typography.Text>
                    </>
                ) : (
                    <>
                        <Input
                            placeholder="Entrez une valeur"
                            label="Lien de partage"
                            icon={<LinkIcon />}
                            value={window.location.href.replace(
                                "doc",
                                "shared"
                            )}
                            readOnly
                            copy
                        />
                        <Select
                            label="Toute personne disposant du lien"
                            layout="horizontal"
                            value={anyonePermission}
                            onValueChange={(value) =>
                                setAnyonePermission(value)
                            }
                        >
                            <Select.Option value="none">
                                Aucune permission
                            </Select.Option>
                            <Select.Option value="read">
                                Peut lire
                            </Select.Option>
                            <Select.Option value="edit">
                                Peut modifier
                            </Select.Option>
                        </Select>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

const ModalContent = styled(Flex)`
    padding: 1rem 0;
`
