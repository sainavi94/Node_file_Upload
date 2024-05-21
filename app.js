const express = require('express');
require('dotenv').config()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid').v4
const { s3UploadV2 } = require('./s3Upload');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const dirPath = path.join(__dirname, 'images')
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dirPath)
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}}`)
    }
})

// for uploading aws s3 buckt use this
// const fileStorage = multer.memoryStorage()

const upload = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.split('/')[0] === 'image') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    limits: {
        fieldSize: 100000000, //mention in bytes only ex: 1 kilobyte = 1000
        files: 2
    }
})


app.post('/single', upload.single('images'), async (req, res) => {
    console.log(req.file);
    const result = await s3UploadV2(req.file)
    res.send("single", result)
})

app.post('/multiple', upload.array('images'), async (req, res) => {
    try {
        console.log(req.files);
        const result = await s3UploadV2(req.files)
        res.send("multiple", result)
    } catch (err) {
        console.log(err)
    }

})

app.listen(3000, () => {
    console.log("Server is running")
})