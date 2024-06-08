const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FlatSchema = new Schema({
    city: String ,
    streetName: String ,
    streetNumber: String ,
    areaSize: Number ,
    hasAc: Boolean, 
    yearBuilt: Date ,
    rentPrice: Number ,
    ownerID: String ,
    dateAvailable: Date ,
    created: Date ,
    modified: Date
});


module.exports = mongoose.model('flats', FlatSchema)