const express = require('express');
const router = express.Router();
const controller = require("./controller")

router.post('/register', controller.register);
router.post('/login', controller.logIn);
module.exports = router;