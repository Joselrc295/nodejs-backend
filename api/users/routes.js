const express = require('express')
const router = express.Router();
const controller = require('./controller')
const passport = require('passport');

router.patch('/update', passport.authenticate('jwt',{session:false}) ,controller.update);
router.get('/users', passport.authenticate('jwt',{session:false}) ,controller.getAllUsers);

module.exports = router