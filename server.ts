import express from 'express'
import bodyParser from 'body-parser'

const port: number = Number(process.env.PORT) || 3000
const app = express()
const router = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.get('/',(req: express.Request,res: express.Response) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`)
})
import RenderPDF from 'chrome-headless-render-pdf'
RenderPDF.generateSinglePdf('http://facebook.com', 'outputPdf.pdf')