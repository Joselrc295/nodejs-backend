const mongoose = require("mongoose");
const Schema = mongoose.Schema

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



module.exports = mongoose.model('favorites', FavoriteSchema)
