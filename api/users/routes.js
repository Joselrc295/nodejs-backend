const express = require('express');
const router = express.Router();
const controller = require('./controller');
const passport = require('passport');
const authController = require("../auth/controller");
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

router.patch('/update-profile/:id', passport.authenticate('jwt', { session: false }), authController.isAdmin, upload.single('avatar'), controller.updateUserById);
router.patch('/update-profile', passport.authenticate('jwt', { session: false }), upload.single('avatar'), controller.updateCurrentUser);
router.get('/', passport.authenticate('jwt', { session: false }), authController.isAdmin, controller.getAllUsers);
router.get('/:id', passport.authenticate('jwt', { session: false }), authController.isAdmin, controller.getUserById);
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), authController.isAdmin, controller.deleteUserById);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;
