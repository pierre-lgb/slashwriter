import WebSocket from 'ws'

import { Server } from '@hocuspocus/server'

import AuthenticationExtension from './AuthentificationExtension'
import PersistenceExtension from './PersistenceExtension'

export function initCollaboration(server) {
    const wss = new WebSocket.Server({ noServer: true })

    const hocuspocus = Server.configure({
        debounce: 5000,
        maxDebounce: 15000,
        timeout: 30000,
        extensions: [new PersistenceExtension(), new AuthenticationExtension()]
    })

    wss.on("connection", (socket) => {
        console.log("incoming connection")
        socket.onclose = () => {
            console.log("connection closed", wss.clients.size)
        }
    })

    server.on("upgrade", (req, socket, head) => {
        if (
            req.url.startsWith(process.env.NEXT_PUBLIC_COLLABORATION_PATHNAME)
        ) {
            const documentName = req.url.split("/").pop()
            if (documentName) {
                wss.handleUpgrade(req, socket, head, (client) => {
                    client.on("error", (error) => {
                        console.error(
                            "Websocket error",
                            error,
                            documentName,
                            req
                        )
                    })
                    hocuspocus.handleConnection(client, req, documentName)
                })
            }

            return
        }

        if (req.url === "/_next/webpack-hmr") {
            return
        }

        socket.end(`HTTP/1.1 400 Bad Request\r\n`)
    })

    server.on("shutdown", () => hocuspocus.destroy())
}
