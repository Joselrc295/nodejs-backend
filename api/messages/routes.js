const express = require('express') ;
const messageRouter = express.Router() ;
const controller = require('./controller') ;
const passport = require('passport')



messageRouter.get('/' , passport.authenticate('jwt',{session:false}) ,controller.getMessages);
messageRouter.post('/', passport.authenticate('jwt',{session:false}) ,controller.publishMessage)

module.exports = messageRouter