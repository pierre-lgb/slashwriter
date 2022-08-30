import cookieParser from 'cookie-parser'
import express from 'express'
import next from 'next'
import cluster from 'node:cluster'
import { createServer } from 'node:http'
import os from 'node:os'
import process from 'node:process'
import url from 'url'

const numCPUs = os.cpus().length

const dev = process.env.NODE_ENV !== "production"
const port = process.env.PORT || 3000

if (!dev && cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`)
    })
} else {
    const nextApp = next({ dev })
    const nextHandler = nextApp.getRequestHandler()

    nextApp.prepare().then(() => {
        const app = express()
        app.use(cookieParser())

        if (!dev) {
            app.use((req, res, next) => {
                const proto = req.headers["x-forwarded-proto"]
                if (proto === "https") {
                    return next()
                }

                res.redirect(`https://${req.header("host")}${req.url}`)
            })
        }

        app.all("*", function handler(req, res) {
            console.log(req)
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
}
