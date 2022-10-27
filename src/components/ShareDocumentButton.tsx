import { ReactNode, useEffect, useState } from "react"
import Flex from "src/components/Flex"
import Button from "src/components/ui/Button"
import Modal from "src/components/ui/Modal"
import { supabaseClient } from "src/utils/supabase"
import styled from "styled-components"

import IosShareOutlined from "@mui/icons-material/IosShareOutlined"

interface ShareDocumentButtonProps {
    documentId: string
    children?: ReactNode
}

export default function ShareDocumentButton(props: ShareDocumentButtonProps) {
    const { documentId, children } = props

    const [email, setEmail] = useState<string>("")
    const [permission, setPermission] = useState<string>("read")
    const [shareSettings, setShareSettings] = useState(null)

    useEffect(() => {
        setEmail("")
        setPermission("read")
        getDocumentShareSettings({ documentId }).then(({ data, error }) => {
            if (error) {
                console.error(error)
                return alert("Une erreur est survenue.")
            }

            setShareSettings(data)
        })

        return () => {
            setShareSettings(null)
        }
    }, [documentId])

    // const handleClick = async () => {
    //     const { data: profile, error } = await supabaseClient
    //         .from("profiles")
    //         .select("id")
    //         .eq("email", email)
    //         .single()

    //     if (error) {
    //         alert("Aucun utilisateur trouvé avec cette adresse email.")
    //         return
    //     }

    //     const { id: userId } = profile

    //     // shareDocumentWithUser({
    //     //     documentId,
    //     //     userId,
    //     //     permission,
    //     //     existingShareSettings: shareSettings || null
    //     // })

    //     setEmail("")
    // }

    return (
        <Modal
            title="Partager"
            description="Choisissez qui peut accéder à votre document."
            triggerElement={
                <Button
                    size="medium"
                    appearance="secondary"
                    icon={<IosShareOutlined />}
                >
                    {children}
                </Button>
            }
            closeButton
        >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa
            necessitatibus velit ab neque incidunt rem eligendi debitis
            accusantium officiis dolorum minima ea, earum et odio, eum impedit,
            omnis harum dignissimos.
        </Modal>
        // <Tippy
        //     content={
        //         <PopoverContainer column gap={5}>
        //             <PopoverTitle>Partager</PopoverTitle>

        //             {shareSettings ? (
        //                 <>
        //                     <Button
        //                         text="Désactiver le partage"
        //                         color="primary"
        //                         onClick={() => {
        //                             deleteShareSettings({
        //                                 id: shareSettings.id
        //                             }).then(({ data, error }) => {
        //                                 if (error) {
        //                                     console.error(error)
        //                                     return alert(
        //                                         "Une erreur est survenue."
        //                                     )
        //                                 }
        //                                 setShareSettings(null)
        //                             })
        //                         }}
        //                     />
        //                     <Flex gap={5}>
        //                         <Select
        //                             label="Tout le monde peut lire"
        //                             onChange={async (e) => {
        //                                 if (e.target.value === "true") {
        //                                     await updateShareSettings({
        //                                         id: shareSettings.id,
        //                                         anyone_can_read: true
        //                                     })
        //                                 } else {
        //                                     await updateShareSettings({
        //                                         id: shareSettings.id,
        //                                         anyone_can_read: false
        //                                     })
        //                                 }
        //                             }}
        //                         >
        //                             <Select.Option value="false">
        //                                 Non
        //                             </Select.Option>
        //                             <Select.Option value="true">
        //                                 Oui
        //                             </Select.Option>
        //                         </Select>
        //                         <Select label="Tout le monde peut modifier">
        //                             <Select.Option value="false">
        //                                 Non
        //                             </Select.Option>
        //                             <Select.Option value="true">
        //                                 Oui
        //                             </Select.Option>
        //                         </Select>
        //                     </Flex>

        //                     <Separator />
        //                     <Flex column gap={5}>
        //                         <span style={{ fontWeight: 500 }}>
        //                             Ajouter un utilisateur
        //                         </span>
        //                         <Input
        //                             value={email}
        //                             onChange={(e) => setEmail(e.target.value)}
        //                             placeholder="Entrez l'email de l'utilisateur"
        //                         />

        //                         <Select
        //                             value={permission}
        //                             onChange={(e) =>
        //                                 setPermission(e.target.value)
        //                             }
        //                         >
        //                             <Select.Option value="read">
        //                                 Peut lire
        //                             </Select.Option>
        //                             <Select.Option value="edit">
        //                                 Peut modifier
        //                             </Select.Option>
        //                         </Select>
        //                         <Button
        //                             icon={<AddOutlined fontSize="small" />}
        //                             color="primary"
        //                             text="Ajouter"
        //                             onClick={async () => {
        //                                 const userId = await getUserIdByEmail({
        //                                     email
        //                                 })

        //                                 const { data, error } =
        //                                     await updateShareSettings({
        //                                         id: shareSettings.id,
        //                                         [`users_can_${permission}`]: (
        //                                             shareSettings[
        //                                                 `users_can_${permission}`
        //                                             ] || []
        //                                         ).concat(userId)
        //                                     })

        //                                 if (error) {
        //                                     console.error(error)
        //                                     return alert(
        //                                         "Une erreur est survenue"
        //                                     )
        //                                 }

        //                                 setShareSettings(data)
        //                             }}
        //                         />

        //                         <pre
        //                             style={{
        //                                 backgroundColor: "var(--color-n50)"
        //                             }}
        //                         >
        //                             {JSON.stringify(shareSettings, null, 2)}
        //                         </pre>
        //                     </Flex>
        //                 </>
        //             ) : (
        //                 <Button
        //                     text="Activer le partage"
        //                     color="primary"
        //                     onClick={() => {
        //                         createShareSettings({ documentId }).then(
        //                             ({ data, error }) => {
        //                                 if (error) {
        //                                     console.error(error)
        //                                     return alert(
        //                                         "Une erreur est survenue"
        //                                     )
        //                                 }
        //                                 setShareSettings(data)
        //                             }
        //                         )
        //                     }}
        //                 />
        //             )}
        //         </PopoverContainer>
        //     }
        //     theme="light-border"
        //     trigger="click"
        //     interactive
        //     arrow={false}
        //     placement="bottom-start"
        // >
        //     <Button
        //         text="Partager"
        //         icon={<IosShareOutlined fontSize="small" />}
        //         border
        //     />
        // </Tippy>
    )
}

const PopoverContainer = styled(Flex)`
    min-width: 250px;
`

const PopoverTitle = styled.h3`
    margin: 10px 0;
`

async function getDocumentShareSettings({ documentId }) {
    const { data, error } = await supabaseClient
        .from("documents")
        .select("share_settings(*)")
        .eq("id", documentId)
        .single()

    return data ? { data: data.share_settings } : { error }
}

function createShareSettings({ documentId }) {
    return supabaseClient
        .from("shares")
        .insert({
            document_id: documentId
        })
        .single()
}

function deleteShareSettings({ id }) {
    return supabaseClient.from("shares").delete().match({ id }).single()
}

function updateShareSettings({ id, ...updates }) {
    return supabaseClient.from("shares").update(updates).match({ id }).single()
}

async function getUserIdByEmail({ email }) {
    const { data, error } = await supabaseClient
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single()

    return data ? data.id : { error }
}
