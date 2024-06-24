const express = require('express')
const router = express.Router();
const controller = require('./controller')
const passport = require('passport');

router.patch('/update-profile/:id', passport.authenticate('jwt',{session:false}) ,controller.updateUserById);
router.patch('/update-profile', passport.authenticate('jwt',{session:false}) ,controller.updateCurrentUser);
router.get('/', passport.authenticate('jwt',{session:false}) ,controller.getAllUsers);
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getUserById);
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), controller.deleteUserById);

module.exports = router