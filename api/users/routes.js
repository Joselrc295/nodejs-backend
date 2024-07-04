const express = require('express')
const router = express.Router();
const controller = require('./controller')
const passport = require('passport');
const authControler = require ("../auth/controller")

router.patch('/update-profile/:id', passport.authenticate('jwt',{session:false}), authControler.isAdmin, controller.updateUserById);
router.patch('/update-profile', passport.authenticate('jwt',{session:false}) ,controller.updateCurrentUser);
router.get('/', passport.authenticate('jwt',{session:false}) , authControler.isAdmin, controller.getAllUsers);
router.get('/:id', passport.authenticate('jwt', { session: false }),authControler.isAdmin, controller.getUserById);
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }),authControler.isAdmin, controller.deleteUserById);

module.exports = router