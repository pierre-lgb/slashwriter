import Router from "next/router"
import { useCallback, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { RiImage2Line as ImageIcon } from "react-icons/ri"
import { useSupabase } from "src/components/supabase/SupabaseProvider"
import Button from "src/components/ui/Button"
import Flex from "src/components/ui/Flex"
import Input from "src/components/ui/Input"
import Loader from "src/components/ui/Loader"
import { v4 as uuidv4 } from "uuid"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import styles from "./ImagePlaceholderComponent.module.scss"

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
    const urlInputRef = useRef<HTMLInputElement | null>(null)
    const { deleteNode, getPos, editor } = props

    const { supabaseClient } = useSupabase()

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

            const documentId = Router.query.docId

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
            className={`${
                props.selected ? "ProseMirror-selectednode" : ""
            } imagePlaceholder`}
        >
            <div className={styles.placeholderContainer}>
                {uploading ? (
                    <Loader />
                ) : (
                    <>
                        <div className={styles.dropzone} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <ImageIcon color="inherit" size={24} />
                            {isDragActive ? (
                                <div className={styles.placeholderText}>
                                    {"Drop the image here"}
                                </div>
                            ) : (
                                <div className={styles.placeholderText}>
                                    {"Drag and drop an image here, "}
                                    <br />
                                    {"or click to select a file."}
                                </div>
                            )}
                        </div>
                        <div className={styles.placeholderText}>- or -</div>
                        <Input
                            placeholder="Enter image URL"
                            inputRef={urlInputRef}
                            actions={
                                <Button
                                    appearance="secondary"
                                    onClick={() => {
                                        const url =
                                            urlInputRef.current?.value || ""
                                        if (!isValidURL(url)) {
                                            alert("Invalid URL.")
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
                                    Import
                                </Button>
                            }
                        />
                    </>
                )}
            </div>
        </NodeViewWrapper>
    )
}
