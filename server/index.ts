// import { createServer } from 'http'
// import next from 'next'
// import process from 'node:process'
// import { parse } from 'url'

// const dev = process.env.NODE_ENV !== "production"
// const app = next({ dev })
// const handle = app.getRequestHandler()

// app.prepare()
//     .then(async () => {
//         const port = parseInt(process.env.PORT, 10) || 3000

//         const server = createServer((req, res) =>
//             handle(req, res, parse(req.url, true))
//         )

//         // The env variables need to be loaded before (for supabaseClient)
//         const { initCollaboration } = await import("./collaboration/index")
//         initCollaboration(server)

//         try {
//             server.listen(port)
//         } catch (error) {
//             console.log(error)
//         }
//     })
//     .catch((error) => console.log(error))

import express from 'express'
import next from 'next'
import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'
import path from 'path'
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

        if (!dev) {
            app.use((req, res, next) => {
                const proto = req.headers["x-forwarded-proto"]
                if (proto === "https") {
                    res.set({
                        "Strict-Transport-Security": "max-age=31557600"
                    })
                    return next()
                }

                res.redirect(`https://${req.header("host")}${req.url}`)
            })
        }

        app.get("*", (req, res) => {
            const parsedUrl = url.parse(req.url, true)
            nextHandler(req, res, parsedUrl)
        })

        const server = app.listen(port, (err) => {
            if (err) throw err
            console.log(`Listening on http://localhost:${port}`)
        })

        // The env variables need to be loaded before
        import("./collaboration/index").then(({ initCollaboration }) =>
            initCollaboration(server)
        )
    })
}
