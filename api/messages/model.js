const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema ({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
    flatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'flats',
        required: true
    },
    message: {
        type: String,
        required: true
      },
      isResponse: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('messages', MessageSchema)