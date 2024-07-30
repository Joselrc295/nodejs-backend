const express = require('express') ;
const router = express.Router();
const controller = require('./controller') ;
const passport = require('passport')
const path = require('path')
const authController = require('../auth/controller')
const multer = require('multer');

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

router.post('/' , passport.authenticate('jwt',{session:false}) ,authController.isLandlord , upload.single('image'), controller.createFlats);
router.get('/' , passport.authenticate('jwt',{session:false}) , controller.getAllFlats);
router.get('/my' , passport.authenticate('jwt',{session:false}) , controller.getMyFlats);
router.get('/:id',  passport.authenticate('jwt',{session:false}) , controller.getFlatByID)
router.patch('/:id', passport.authenticate('jwt',{session:false}), upload.single('image'), controller.updateFlatById)
router.delete('/admin/:id', passport.authenticate('jwt',{session:false}), authController.isAdmin, controller.deleteFlat)
router.delete('/:id',passport.authenticate('jwt',{session:false}),  controller.deleteFlat)


module.exports = router



