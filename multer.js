const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, '/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 & 1024,
    }
})

module.exports = upload