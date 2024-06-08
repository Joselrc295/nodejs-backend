const express = require('express') ;
const router = express.Router();
const controller = require('./controller') ;
const passport = require('passport')
const authController = require('../auth/controller')

router.post('/' , passport.authenticate('jwt',{session:false}) ,authController.isLandlord , controller.createFlats)

module.exports = router



