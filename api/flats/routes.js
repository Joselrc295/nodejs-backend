const express = require('express') ;
const router = express.Router();
const controller = require('./controller') ;
const passport = require('passport')
const authController = require('../auth/controller')

router.post('/' , passport.authenticate('jwt',{session:false}) ,authController.isLandlord , controller.createFlats);
router.get('/' , passport.authenticate('jwt',{session:false}) ,authController.isLandlord , controller.getAllFlats);
router.get('/my' , passport.authenticate('jwt',{session:false}) , controller.getMyFlats);
router.get('/:id',  passport.authenticate('jwt',{session:false}) , controller.getFlatByID)


module.exports = router



