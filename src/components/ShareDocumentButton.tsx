import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import {
    RiArrowDownSLine as ExpandIcon,
    RiCheckLine as CheckedIcon,
    RiCloseLine as CrossIcon,
    RiLinkM as LinkIcon,
    RiShareLine as ShareIcon,
    RiUserAddLine as AddUserIcon
} from "react-icons/ri"
import Flex from "src/components/Flex"
import Button from "src/components/ui/Button"
import Input from "src/components/ui/Input"
import Modal from "src/components/ui/Modal"
import Select from "src/components/ui/Select"
import { useAppSelector } from "src/store"
import { supabaseClient } from "src/utils/supabase"
import styled from "styled-components"

import Loader from "./ui/Loader"
import Menu from "./ui/navigation/Menu"
import Typography from "./ui/Typography"

interface ShareDocumentButtonProps {
    documentId: string
    children?: ReactNode
}

export default function ShareDocumentButton(props: ShareDocumentButtonProps) {
    const { documentId, children } = props

    const [modalVisible, setModalVisible] = useState(false)
    const [inherited, setInherited] = useState(false)
    const [shareSettings, setShareSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userQuery, setUserQuery] = useState("")
    const [addUserFieldError, setAddUserFieldError] = useState(null)

    const { documentInheritedFrom } = useAppSelector((state) => ({
        documentInheritedFrom: state.documents.documents.find(
            (d) => d.id === shareSettings?.document_id
        )
    }))

    const disableInheritance = async () => {
        const { error } = await supabaseClient
            .from("documents")
            .update({ share_settings: null })
            .match({ id: documentId })
            .single()

        if (error) {
            console.error(error)
            return setError(error.message)
        }

        setShareSettings(null)
        setInherited(false)
    }

    const updateShareSettings = async (settings) => {
        if (!shareSettings) {
            // Create share settings if not existing yet
            const { data: share_settings, error } = await supabaseClient
                .from("shares")
                .insert({ document_id: documentId, ...(settings || {}) })
                .select("*")
                .single()

            if (error) {
                console.error(error)
                return setError(error.message)
            }

            return setShareSettings(share_settings)
        }

        // Update existing share settings
        const { data: share_settings, error } = await supabaseClient
            .from("shares")
            .update(settings)
            .match({ id: shareSettings.id })
            .select("*")
            .single()

        if (error) {
            console.error(error)
            return setError(error.message)
        }

        setShareSettings(share_settings)
    }

    const deleteShareSettings = async () => {
        const { error } = await supabaseClient
            .from("shares")
            .delete()
            .match({ id: shareSettings.id })

        if (error) {
            console.error(error)
            return setError(error.message)
        }

        setShareSettings(null)
    }

    const handleAddUser = async () => {
        setAddUserFieldError(null)

        if (!userQuery) {
            return
        }

        const { data: foundUser, error } = await supabaseClient
            .from("profiles")
            .select("id")
            .or(`username.eq.${userQuery},email.eq.${userQuery}`)
            .maybeSingle()

        if (error) {
            return setAddUserFieldError("Une erreur est survenue.")
        }

        if (!foundUser) {
            return setAddUserFieldError("Aucun utilisateur trouvé.")
        }

        if (shareSettings?.user_id === foundUser.id) {
            return setAddUserFieldError(
                "Vous ne pouvez pas vous inviter vous-même."
            )
        }

        if (shareSettings?.user_permissions?.[foundUser.id]) {
            setAddUserFieldError("Cet utilisateur a déjà été ajouté.")
            return
        }

        updateShareSettings({
            user_permissions: {
                ...(shareSettings?.user_permissions || {}),
                [foundUser.id]: "read"
            }
        })
        setUserQuery("")
    }

    const setUserPermission = (user_id, permission) => {
        const user_permissions = { ...shareSettings?.user_permissions }

        if (["edit", "read"].includes(permission)) {
            user_permissions[user_id] = permission
        } else {
            delete user_permissions[user_id]
        }

        updateShareSettings({
            user_permissions
        })
    }

    useEffect(() => {
        async function fetchShareSettings() {
            setLoading(true)
            setError(null)

            const { data, error } = await supabaseClient
                .from("documents")
                .select("share_settings (*)")
                .eq("id", documentId)
                .single()

            setLoading(false)

            if (error) {
                console.error(error)
                return setError(error.message)
            }

            if (data && data.share_settings) {
                setInherited(documentId !== data.share_settings.document_id)
                setShareSettings(data.share_settings)
            }
        }

        // Fetch share settings whenever the modal is opened
        if (modalVisible) {
            fetchShareSettings()
        }

        return () => {
            setShareSettings(null)
        }
    }, [modalVisible, documentId])

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
            footer={
                <>
                    {!!shareSettings && !inherited && (
                        <Button
                            onClick={deleteShareSettings}
                            appearance="secondary"
                            danger
                        >
                            Supprimer le partage
                        </Button>
                    )}
                    <Button
                        onClick={() => setModalVisible(false)}
                        appearance="primary"
                    >
                        Terminé
                    </Button>
                </>
            }
            onCancel={() => {
                setModalVisible(false)
            }}
            closeButton
        >
            <ModalContent column align="center" gap={20}>
                {loading ? (
                    <Loader />
                ) : !!error ? (
                    <Typography.Text align="center" type="danger">
                        Une erreur est survenue: <br />
                        {error}
                    </Typography.Text>
                ) : inherited ? (
                    <Typography.Text>
                        Les paramètres de partage de ce document sont hérités du
                        document{" "}
                        <Link href={`/doc/${shareSettings?.document_id}`}>
                            <Typography.Link>
                                {documentInheritedFrom?.title || "Sans titre"}
                            </Typography.Link>
                        </Link>
                        .{" "}
                        <Button
                            danger
                            appearance="secondary"
                            size="small"
                            onClick={disableInheritance}
                        >
                            Dissocier
                        </Button>
                    </Typography.Text>
                ) : (
                    <>
                        <Input
                            placeholder="Entrez une valeur"
                            label="Lien de partage"
                            icon={<LinkIcon />}
                            value={window.location.href}
                            readOnly
                            copy
                        />
                        <Select
                            label="Toute personne disposant du lien"
                            layout="horizontal"
                            value={shareSettings?.anyone_permission || "none"}
                            onValueChange={(value) => {
                                updateShareSettings({
                                    anyone_permission: value
                                })
                            }}
                            size="small"
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
                        <Flex column style={{ width: "100%" }} gap={10}>
                            <Input
                                label="Ajouter des utilisateurs"
                                layout="vertical"
                                placeholder="Nom d'utilisateur ou adresse email"
                                value={userQuery}
                                actions={
                                    <Button
                                        appearance="secondary"
                                        icon={<AddUserIcon />}
                                        onClick={handleAddUser}
                                    >
                                        Ajouter
                                    </Button>
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        return handleAddUser()
                                    }
                                }}
                                onBlur={() => setAddUserFieldError(null)}
                                onChange={(e) => setUserQuery(e.target.value)}
                                error={addUserFieldError}
                            />

                            {Object.entries(
                                shareSettings?.user_permissions || []
                            )
                                .sort((a, b) => a[0].localeCompare(b[0]))
                                .map(
                                    ([user_id, permission]: [
                                        string,
                                        string
                                    ]) => (
                                        <Flex
                                            justify="space-between"
                                            style={{ padding: "0 10px" }}
                                            key={user_id}
                                        >
                                            <Typography.Text
                                                small
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                }}
                                            >
                                                {user_id}
                                            </Typography.Text>
                                            <Menu
                                                content={(instance) => (
                                                    <Flex column>
                                                        <Menu.Item
                                                            icon={
                                                                permission ===
                                                                "read" ? (
                                                                    <CheckedIcon />
                                                                ) : null
                                                            }
                                                            title="Peut lire"
                                                            onClick={() => {
                                                                setUserPermission(
                                                                    user_id,
                                                                    "read"
                                                                )
                                                            }}
                                                            menu={instance}
                                                        />
                                                        <Menu.Item
                                                            icon={
                                                                permission ===
                                                                "edit" ? (
                                                                    <CheckedIcon />
                                                                ) : null
                                                            }
                                                            title="Peut modifier"
                                                            onClick={() => {
                                                                setUserPermission(
                                                                    user_id,
                                                                    "edit"
                                                                )
                                                            }}
                                                            menu={instance}
                                                        />
                                                        <Menu.Item
                                                            icon={<CrossIcon />}
                                                            title="Supprimer"
                                                            onClick={() =>
                                                                setUserPermission(
                                                                    user_id,
                                                                    "none"
                                                                )
                                                            }
                                                            menu={instance}
                                                            style={{
                                                                color: "var(--color-red)"
                                                            }}
                                                        />
                                                    </Flex>
                                                )}
                                            >
                                                <Button
                                                    appearance="text"
                                                    size="small"
                                                    icon={<ExpandIcon />}
                                                    style={{ flexShrink: 0 }}
                                                >
                                                    {permission === "edit"
                                                        ? "Peut modifier"
                                                        : "Peut lire"}
                                                </Button>
                                            </Menu>
                                        </Flex>
                                    )
                                )}
                        </Flex>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

const ModalContent = styled(Flex)`
    padding: 1rem 0;
`
