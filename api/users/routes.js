const express = require('express')
const router = express.Router();
const controller = require('./controller')
const passport = require('passport');

router.patch('/', passport.authenticate('jwt',{session:false}) ,controller.update);
router.get('/', passport.authenticate('jwt',{session:false}) ,controller.getAllUsers);

module.exports = router