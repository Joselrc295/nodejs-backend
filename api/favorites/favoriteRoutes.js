const express = require('express') ;
const favoriteRouter = express.Router() ;
const controller = require('./favoritesController') ;
const passport = require('passport')



favoriteRouter.get('/' , passport.authenticate('jwt',{session:false}) ,controller.getFavorites);
favoriteRouter.post('/', passport.authenticate('jwt',{session:false}) ,controller.addFavorites)
favoriteRouter.delete('/:id', passport.authenticate('jwt',{session:false}) ,controller.removeFavorites)
favoriteRouter.get('/home', passport.authenticate('jwt',{session:false}) ,controller.getFavoritesHome)
module.exports = favoriteRouter