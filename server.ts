import express = require('express')
import bodyParser = require('body-parser');
import RenderPDF from 'chrome-headless-render-pdf'

const port: number = Number(process.env.PORT) || 3000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('.'))
app.get('/',(req: express.Request,res: express.Response) =>
    res.sendFile('index.html',{root: __dirname})
)

const checkProtocolExists = (url: string) => /^(https?:\/\/)?/i.test(url)

const validURL = (url: string) => /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(url)

app.post('/', (req: express.Request, res: express.Response) => {
    let urlInput = req.body.urlInput
    let urlProtocolCheck = checkProtocolExists(urlInput) ? urlInput : `http://${urlInput}`
    validURL(urlProtocolCheck) ?
        RenderPDF
            .generatePdfBuffer(urlProtocolCheck)
            .then((pdfBuffer: Buffer) =>
                res.set('Content-Type','application/pdf').send(pdfBuffer)
            )
            .catch((error: string) =>
                res.status(500).send(error)
            )
    :
        res.statusMessage = 'Invalid URL'
        res.status(500).send()
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
})