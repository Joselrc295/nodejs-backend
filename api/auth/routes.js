const express = require('express');
const router = express.Router();
const controller = require("./controller");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });
router.post('/register', upload.single('avatar'), controller.register);
router.post('/login', controller.logIn);
module.exports = router;