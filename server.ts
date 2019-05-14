import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import RenderPDF from 'chrome-headless-render-pdf'

const port: number = Number(process.env.PORT) || 3000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
console.log(path.join(__dirname, 'public'))
app.use('/public',express.static(path.join(__dirname,'public')))
app.get('/',(req: express.Request,res: express.Response) =>
    res.sendFile('index.html',{root: __dirname})
)

const checkProtocolExists = (url: string) => /^(https?:\/\/)/i.test(url)

const validURL = (url: string) => /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(url)

app.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let urlInput = req.body.urlInput
    let urlProtocolCheck = checkProtocolExists(urlInput) ? urlInput : `http://${urlInput}`
    validURL(urlProtocolCheck) ?
       await RenderPDF
            .generatePdfBuffer(urlProtocolCheck,{"chromeBinary" : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" })
            .then((pdfBuffer: Buffer) =>
                res.set('Content-Type','application/pdf').send(pdfBuffer)
            )
            .catch(next)
    :
        res.status(500).send()
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
})