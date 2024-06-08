const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "please provide your first name"]
    },
    lastName: {
        type: String,
        required: [true, "please provide your last name"]
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email"],
        unique: true
    },
    password: {
        type: String,
        minlength:6,
        required: true
    },
    birthday:{
        type: Date,
        required: [true, "please provide a valid birthday date"]
    },
    role:{
        type: String,
        default: "user",
        enum: ["landlord", "admin", "renter"],
        default: 'renter'
    },
    created: Date,
    modified: Date
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
UserSchema.methods ={
    authenticate : function(password) {
      return  bcrypt.compareSync(password, this.password)
    }
}

module.exports =mongoose.model('users', UserSchema)