import express = require('express')
import bodyParser = require('body-parser');
import RenderPDF from 'chrome-headless-render-pdf'

const port: number = Number(process.env.PORT) || 3000
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('.'))
app.get('/',(req: express.Request,res: express.Response) => {
    res.sendFile('index.html',{root: __dirname})
})

app.post('/', (req: express.Request, res: express.Response) => {
    let urlInput = req.body.urlInput
    const httpReg = RegExp('^http://')
    const httpsReg = RegExp('^https://')
    let url = httpReg.test(urlInput) || httpsReg.test(urlInput) ? urlInput : `http://${urlInput}`
    RenderPDF.generatePdfBuffer(url)
        .then((pdfBuffer) => {
            res.set('Content-Type','application/pdf')
            res.send(pdfBuffer)
        });
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
})