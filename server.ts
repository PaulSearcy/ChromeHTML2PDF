import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import RenderPDF from 'chrome-headless-render-pdf'
import os from 'os'

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

// const createBuffer = async (url:string) =>
//     os.platform() === 'win32' ?
//         await RenderPDF
//             .generatePdfBuffer(url,{"chromeBinary" : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" })
//     :
//         await RenderPDF
//             .generatePdfBuffer(url)


app.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let urlInput = req.body.urlInput
    let urlProtocolCheck = checkProtocolExists(urlInput) ? urlInput : `http://${urlInput}`
    if(validURL(urlProtocolCheck)) {
        // try {
        //     createBuffer(urlProtocolCheck).then((pdfBuffer: any) =>
        //         res.set('Content-Type','application/pdf').send(pdfBuffer)
        //     )
        // } catch(error){
        //     next
        // }
       await RenderPDF
            .generatePdfBuffer(urlProtocolCheck,{
                chromeOptions: ['--no-sandbox']
            })
            .then((pdfBuffer: Buffer) =>
                res.set('Content-Type','application/pdf').send(pdfBuffer)
            )
            .catch(next)
    }else{
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
})