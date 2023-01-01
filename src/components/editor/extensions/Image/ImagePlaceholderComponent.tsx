import { useCallback, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { RiImage2Line as ImageIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import Button from "src/components/ui/Button"
import Input from "src/components/ui/Input"
import Loader from "src/components/ui/Loader"
import store from "src/store"
import { supabaseClient } from "src/utils/supabase"
import styled from "styled-components"
import { v4 as uuidv4 } from "uuid"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

function isValidURL(url: string) {
    const URLRegExp = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
        "i"
    ) // fragment locator
    return !!URLRegExp.test(url)
}

export default function ImagePlaceholderComponent(props: NodeViewProps) {
    const [uploading, setUploading] = useState(false)
    const urlInputRef = useRef<HTMLInputElement>()
    const { deleteNode, getPos, editor } = props

    const insertImage = useCallback(
        (attrs) => {
            editor
                .chain()
                .focus()
                .insertContentAt(getPos(), {
                    type: "image",
                    attrs
                })
                .run()
        },
        [editor, getPos]
    )

    const onDrop = useCallback(
        async (files) => {
            const imageFile = files[0]

            setUploading(true)

            const documentId = store.getState().navigation.activeDocument

            // Upload
            const { data, error } = await supabaseClient.storage
                .from("documents_uploads")
                .upload(
                    `${documentId}/${uuidv4()}-${imageFile.name}`,
                    imageFile
                )

            if (error) {
                console.log(error)
                return
            }

            if (data?.path) {
                // Upload image to storage
                const {
                    data: { publicUrl }
                } = supabaseClient.storage
                    .from("documents_uploads")
                    .getPublicUrl(data.path)

                // Insert image in the editor
                insertImage({
                    src: publicUrl
                })

                // Remove the placeholder
                deleteNode()
            } else {
                alert("Une erreur est survenue lors de l'envoi de l'image")
                console.error(error)
            }

            setUploading(false)
        },
        [deleteNode, insertImage]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            "image/gif": []
        },
        multiple: false,
        onDropAccepted: onDrop,
        maxSize: 5 * 10 ** 6 // 5 MB
    })

    return (
        <NodeViewWrapper
            className={
                props.selected
                    ? "ProseMirror-selectednode imagePlaceholder"
                    : "imagePlaceholder"
            }
        >
            <PlaceholderContainer>
                {uploading ? (
                    <Loader />
                ) : (
                    <>
                        <Flex column align="center" gap={5} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <ImageIcon color="inherit" size={24} />
                            {isDragActive ? (
                                <PlaceholderText>
                                    {"Déposez l'image ici"}
                                </PlaceholderText>
                            ) : (
                                <PlaceholderText>
                                    {"Glissez et déposez l'image ici, "}
                                    <br />
                                    {"ou cliquez pour sélectionner un fichier"}
                                </PlaceholderText>
                            )}
                        </Flex>
                        <PlaceholderText>- ou -</PlaceholderText>
                        <Input
                            placeholder="Entrez l'URL de l'image"
                            inputRef={urlInputRef}
                            actions={
                                <Button
                                    appearance="secondary"
                                    onClick={() => {
                                        const url = urlInputRef.current.value
                                        if (!isValidURL(url)) {
                                            alert("URL invalide.")
                                            return
                                        }

                                        // Insert image in the editor
                                        insertImage({
                                            src: url
                                        })

                                        // Remove the placeholder
                                        deleteNode()
                                    }}
                                >
                                    Importer
                                </Button>
                            }
                        />
                    </>
                )}
            </PlaceholderContainer>
        </NodeViewWrapper>
    )
}

const PlaceholderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--color-n50);
    border: 1px solid var(--color-n300);
    height: 170px;
    padding: 1rem;
    color: var(--color-n700);
    cursor: pointer;
    gap: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--color-n100);
    }
`

const PlaceholderText = styled.div`
    text-align: center;
    font-size: 0.95rem;
    user-select: none;
    line-height: 120%;
`
