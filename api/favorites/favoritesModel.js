const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true 
},
flatID: {
    type: mongoose.Schema.ObjectId,
    ref: 'flats',
    required: true
}
}) ;

FavoriteSchema.pre(/^find/,function async(next){
    this.populate({
        path:'flatID'
    })
    next() ;
})

module.exports = mongoose.model('favorites', FavoriteSchema)
