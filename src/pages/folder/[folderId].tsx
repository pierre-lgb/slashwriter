import moment from "moment"
import { useRouter } from "next/router"
import { useState } from "react"
import {
    RiDeleteBin7Line as DeleteIcon,
    RiEdit2Line as RenameIcon,
    RiFolder2Line as FolderIcon
} from "react-icons/ri"
import * as documentsApi from "src/api/documents"
import * as foldersApi from "src/api/folders"
import AddDocumentButton from "src/components/AddDocumentButton"
import DocumentLink from "src/components/editor/components/DocumentLink"
import Flex from "src/components/Flex"
import AppLayout from "src/components/layouts/AppLayout"
import Separator from "src/components/Separator"
import TransitionOpacity from "src/components/TransitionOpacity"
import Button from "src/components/ui/Button"
import Select from "src/components/ui/Select"
import Typography from "src/components/ui/Typography"
import { useAppDispatch, useAppSelector } from "src/store"
import { withPageAuth } from "src/utils/supabase"
import styled from "styled-components"

import Tippy from "@tippyjs/react"

function DeleteFolderButton({ folderId }) {
    const dispatch = useAppDispatch()
    const router = useRouter()

    return (
        <Tippy content="Supprimer" arrow={false}>
            <Button
                appearance="text"
                onClick={() => {
                    const confirmation = confirm(
                        "Êtes-vous certain de vouloir supprimer ce dossier ?"
                    )
                    if (!confirmation) return

                    dispatch(
                        foldersApi.updateFolder({ id: folderId, deleted: true })
                    )

                    alert("Dossier supprimé.")

                    router.push("/home")
                }}
                icon={<DeleteIcon />}
                tabIndex={-1}
            />
        </Tippy>
    )
}

function RenameFolderButton({ folderId }) {
    const dispatch = useAppDispatch()

    return (
        <Tippy content="Renommer" arrow={false}>
            <Button
                appearance="text"
                onClick={() => {
                    const folderName = prompt("Renommer le dossier :")
                    if (!folderName) return

                    dispatch(
                        foldersApi.updateFolder({
                            id: folderId,
                            name: folderName
                        })
                    )

                    alert("Dossier renommé.")
                }}
                icon={<RenameIcon />}
                tabIndex={-1}
            />
        </Tippy>
    )
}

function DeleteDocumentButton({ documentId }) {
    const dispatch = useAppDispatch()

    return (
        <Tippy content="Supprimer" arrow={false} placement="bottom">
            <Button
                appearance="text"
                onClick={(e) => {
                    e.preventDefault()

                    if (confirm("Envoyer le document dans la corbeille ?")) {
                        dispatch(
                            documentsApi.updateDocument({
                                id: documentId,
                                deleted: true
                            })
                        )
                    }
                }}
                icon={<DeleteIcon />}
                size="small"
                tabIndex={-1}
            />
        </Tippy>
    )
}

function Folder() {
    const [sortOrder, setSortOrder] = useState("a-z")
    const router = useRouter()
    const { folderId } = router.query as { folderId: string }

    const { folder, isLoadingFolder } = useAppSelector((state) => ({
        folder: state.folders.folders.find((f) => f.id === folderId),
        isLoadingFolder: state.folders.isLoading
    }))

    const { subfolders } = useAppSelector((state) => ({
        subfolders: state.folders.folders.filter(
            (f) => f.parent_id === folderId
        )
    }))

    const { documents } = useAppSelector((state) => ({
        documents: state.documents.documents.filter(
            (d) => d.folder_id === folderId && !d.parent_id
        )
    }))

    return (
        <TransitionOpacity>
            <Container>
                <Content>
                    {!!folder && (
                        <>
                            <FolderTitle>
                                <Typography.Title level={2}>
                                    {folder.name}
                                </Typography.Title>
                                <Flex gap={5}>
                                    <RenameFolderButton folderId={folderId} />
                                    <DeleteFolderButton folderId={folderId} />
                                </Flex>
                            </FolderTitle>

                            <DocumentList column gap={5}>
                                <Flex
                                    align="center"
                                    justify="space-between"
                                    gap={10}
                                >
                                    <Select
                                        value={sortOrder}
                                        onValueChange={(value) => {
                                            setSortOrder(value)
                                        }}
                                    >
                                        <Select.Option value="a-z">
                                            De A à Z
                                        </Select.Option>
                                        <Select.Option value="z-a">
                                            De Z à A
                                        </Select.Option>
                                        <Select.Option value="recent">
                                            Récents
                                        </Select.Option>
                                    </Select>

                                    <AddDocumentButton
                                        folderId={folderId}
                                        appearance="primary"
                                    >
                                        Nouveau
                                    </AddDocumentButton>
                                </Flex>
                                <Separator />
                                {!!subfolders.length &&
                                    subfolders.map((folder) => (
                                        <Button
                                            key={folder.id}
                                            appearance="secondary"
                                            icon={<FolderIcon />}
                                            onClick={() => {
                                                router.push(
                                                    `/folder/${folder.id}`
                                                )
                                            }}
                                        >
                                            {folder.name}
                                        </Button>
                                    ))}

                                {documents
                                    ?.sort((a, b) => {
                                        switch (sortOrder) {
                                            case "a-z":
                                                return (
                                                    a.title || ""
                                                ).localeCompare(b.title || "")
                                            case "z-a":
                                                return (
                                                    b.title || ""
                                                ).localeCompare(a.title || "")
                                            case "recent":
                                                return (
                                                    new Date(
                                                        b.updated_at
                                                    ).getTime() -
                                                    new Date(
                                                        a.updated_at
                                                    ).getTime()
                                                )

                                            case "old":
                                                return (
                                                    new Date(
                                                        a.updated_at
                                                    ).getTime() -
                                                    new Date(
                                                        b.updated_at
                                                    ).getTime()
                                                )
                                        }
                                    })
                                    .map((document, index) => (
                                        <DocumentLink
                                            href={`/doc/${document.id}`}
                                            key={index}
                                            title={
                                                document.title || "Sans titre"
                                            }
                                            status={`Modifié le ${moment(
                                                new Date(document.updated_at)
                                            ).format("DD/MM/YYYY")} à ${moment(
                                                new Date(document.updated_at)
                                            ).format("HH:mm")}`}
                                            actions={
                                                <Flex align="center">
                                                    <DeleteDocumentButton
                                                        documentId={document.id}
                                                    />
                                                </Flex>
                                            }
                                        />
                                    ))}
                            </DocumentList>
                        </>
                    )}
                    {!folder && !isLoadingFolder && (
                        <Typography.Text>
                            Désolé, ce dossier n&apos;existe pas. S&apos;il
                            existait avant, cela signifie qu&apos;il a été
                            supprimé.
                        </Typography.Text>
                    )}
                </Content>
            </Container>
        </TransitionOpacity>
    )
}

Folder.Layout = AppLayout
Folder.Title = "Dossier"

const Container = styled.div`
    padding: 100px 25px;
`

const Content = styled.div`
    margin: 25px auto;
    max-width: 700px;
    display: flex;
    flex-direction: column;
`

const FolderTitle = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 20px;

    & button {
        opacity: 0;
        transition: opacity ease-out 100ms;
    }

    &:hover button {
        opacity: 1;
    }
`

const DocumentList = styled(Flex)`
    margin-top: 20px;
`

export const getServerSideProps = withPageAuth()

export default Folder
