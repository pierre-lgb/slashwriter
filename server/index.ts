import cookieParser from "cookie-parser"
import express from "express"
import next from "next"
import { createServer } from "node:http"
import process from "node:process"
import url from "url"

const port = parseInt(process.env.PORT || "3000", 10)
const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
    const app = express()
    app.use(cookieParser())

    app.all("*", function handler(req, res) {
        const parsedUrl = url.parse(req.url, true)
        nextHandler(req, res, parsedUrl)
    })

    const server = createServer(app)

    // The env variables need to be loaded before
    import("./collaboration/index").then(({ initCollaboration }) =>
        initCollaboration(server)
    )

    try {
        server.listen(port)
    } catch (error) {
        console.log(error)
    }
})
