import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import {
    RiArrowDownSLine as ExpandIcon,
    RiCheckLine as CheckedIcon,
    RiCloseLine as CrossIcon,
    RiLinkM as LinkIcon,
    RiShareForwardLine as ShareIcon,
    RiUserAddLine as AddUserIcon
} from "react-icons/ri"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Button from "src/components/ui/Button"
import Flex from "src/components/ui/Flex"
import Input from "src/components/ui/Input"
import Loader from "src/components/ui/Loader"
import Menu from "src/components/ui/Menu"
import Modal from "src/components/ui/Modal"
import Select from "src/components/ui/Select"
import Typography from "src/components/ui/Typography"
import { useAppSelector } from "src/store"

interface ShareDocumentButtonProps {
    documentId: string
    children?: ReactNode
}

export default function ShareDocumentButton(props: ShareDocumentButtonProps) {
    const { documentId, children } = props

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [inherited, setInherited] = useState<boolean>(false)
    const [shareSettings, setShareSettings] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>()
    const [userQuery, setUserQuery] = useState<string>("")
    const [addUserFieldError, setAddUserFieldError] = useState<string>()
    const { session, supabaseClient } = useSupabase()

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
        setAddUserFieldError("")

        if (!userQuery) {
            return
        }

        const { data: foundUser, error } = await supabaseClient
            .from("profiles")
            .select("id")
            .or(`username.eq.${userQuery},email.eq.${userQuery}`)
            .maybeSingle()

        if (error) {
            return setAddUserFieldError("An error occured.")
        }

        if (!foundUser) {
            return setAddUserFieldError("No user found.")
        }

        if (session?.user.id === foundUser.id) {
            return setAddUserFieldError("You cannot invite yourself.")
        }

        if (shareSettings?.user_permissions?.[foundUser.id]) {
            setAddUserFieldError("This user has already been added.")
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
            setError("")

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

            const share_settings = data?.share_settings as any
            if (share_settings) {
                setInherited(documentId !== share_settings.document_id)
                setShareSettings(share_settings)
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
            title="Share"
            description="Choose who can access your document."
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
                            Stop sharing
                        </Button>
                    )}
                    <Button
                        onClick={() => setModalVisible(false)}
                        appearance="primary"
                    >
                        Done
                    </Button>
                </>
            }
            onCancel={() => {
                setModalVisible(false)
            }}
            closeButton
        >
            <Flex column align="center" gap={20} style={{ padding: "1rem 0" }}>
                {loading ? (
                    <Loader />
                ) : !!error ? (
                    <Typography.Text align="center" type="danger">
                        An error occured: <br />
                        {error}
                    </Typography.Text>
                ) : inherited ? (
                    <Typography.Text>
                        {
                            "This document's share settings are inherited from another document: "
                        }
                        <Link href={`/doc/${shareSettings?.document_id}`}>
                            <Typography.Link>
                                {documentInheritedFrom?.title || "Sans titre"}
                            </Typography.Link>
                        </Link>
                        {". "}
                        <Button
                            danger
                            appearance="secondary"
                            size="small"
                            onClick={disableInheritance}
                        >
                            Dissociate
                        </Button>
                    </Typography.Text>
                ) : (
                    <>
                        <Input
                            label="Share link"
                            icon={<LinkIcon />}
                            value={window.location.href}
                            readOnly
                            copy
                        />
                        <Select
                            label="Anyone with the link"
                            layout="horizontal"
                            value={shareSettings?.anyone_permission || "none"}
                            onValueChange={(value) => {
                                updateShareSettings({
                                    anyone_permission: value
                                })
                            }}
                            size="medium"
                        >
                            <Select.Option value="none">
                                No permission
                            </Select.Option>
                            <Select.Option value="read">Can read</Select.Option>
                            <Select.Option value="edit">Can edit</Select.Option>
                        </Select>
                        <Flex column style={{ width: "100%" }} gap={10}>
                            <Input
                                label="Add users"
                                layout="vertical"
                                placeholder="Username or email"
                                value={userQuery}
                                actions={
                                    <Button
                                        appearance="secondary"
                                        icon={<AddUserIcon />}
                                        onClick={handleAddUser}
                                    >
                                        Add
                                    </Button>
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        return handleAddUser()
                                    }
                                }}
                                onBlur={() => setAddUserFieldError("")}
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
                                                            title="Can read"
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
                                                            title="Can edit"
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
                                                            title="Remove user"
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
                                                        ? "Can edit"
                                                        : "Can read"}
                                                </Button>
                                            </Menu>
                                        </Flex>
                                    )
                                )}
                        </Flex>
                    </>
                )}
            </Flex>
        </Modal>
    )
}
