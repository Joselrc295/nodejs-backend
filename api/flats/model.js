const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FlatSchema = new Schema({
    city: String ,
    streetName: String ,
    streetNumber: String ,
    areaSize: Number ,
    hasAc: Boolean, 
    yearBuilt: Number ,
    rentPrice: Number ,
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    flatCreator: String,
    flatCreatorEmail: String, 
    status:{ 
    type: Boolean, 
    default: true    
    },
    dateAvailable: Date ,
    created: Date ,
    modified: Date
});


module.exports = mongoose.model('flats', FlatSchema)