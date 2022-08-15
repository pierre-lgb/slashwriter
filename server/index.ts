import { createServer } from 'http'
import next from 'next'
import process from 'node:process'
import { parse } from 'url'

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

process.on("uncaughtException", (exception) => console.log(exception))

app.prepare().then(async () => {
    const hostname = process.env.HOSTNAME
    const port = parseInt(process.env.PORT, 10)

    const server = createServer((req, res) =>
        handle(req, res, parse(req.url, true))
    )

    // The env variables need to be loaded before (for supabaseClient)
    const { initCollaboration } = await import("./collaboration/index")
    initCollaboration(server)

    try {
        server.listen(port, hostname)
    } catch (error) {
        console.log(error)
    }
}).catch(error => console.log(error))
