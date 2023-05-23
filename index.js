const express = require("express")
const multer = require("multer")
const PDFDocument = require("pdf-lib").PDFDocument
const fs = require("node:fs")
const app = express()
const port = 4000

//file upload

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "uploads/")
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    },
});
const upload = multer({storage});

//api
app.post('/file-upload', upload.single('pdf'),(req,res)=>{
  


    if(req?.file){
        const filePath = `./uploads/${req.file.originalname}`
        const existingToBytes = fs.readFileSync(filePath)
        compressFile(existingToBytes , req.file.originalname)
        return res.status(200).send("File uploaded")
    } else{
        return res.status(500).send("File is not uploaded")
    }
})

compressFile = async (existingToBytes, originalname)=>{
    const pdfDoc = await PDFDocument.load(existingToBytes)
    const compressedPdfBytes = await pdfDoc.save()
    fs,fs.writeFileSync(`./uploads/compressed/${originalname}`,compressedPdfBytes)
}

app.listen(port,()=>{
    console.log(`Server running in port ${port}`)
})

