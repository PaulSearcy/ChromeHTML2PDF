"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var chrome_headless_render_pdf_1 = require("chrome-headless-render-pdf");
var port = Number(process.env.PORT) || 3000;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});
app.post('/', function (req, res) {
    var urlInput = req.body.urlInput;
    var httpReg = RegExp('^http://');
    var httpsReg = RegExp('^https://');
    var url = httpReg.test(urlInput) || httpsReg.test(urlInput) ? urlInput : "http://" + urlInput;
    chrome_headless_render_pdf_1["default"].generatePdfBuffer(url)
        .then(function (pdfBuffer) {
        res.set('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    });
});
app.listen(port, function () {
    console.log("Listening at http://localhost:" + port + "/");
});
