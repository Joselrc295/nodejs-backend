const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const {v4: uuidv4} = require( 'uuid');

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
    modified: Date,
    resetPasswordToken: String,
    passwordChangedAt: Date,
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
    },

generatePasswordResetToken: function(){
    this.resetPasswordToken = uuidv4();
    return this.resetPasswordToken
},
resetPassword: function(password){
    this.password = password;
    this.resetPasswordToken = '';
    this.passwordChangedAt = new Date();   

},
changePasswordAfter: function(JWTTimeStamp){
    if(this.changePasswordAt){
        const changedTimeStamp = parseInt(this.changePasswordAt.getTime()/1000);
        return JWTTimeStamp < changeTimeStamp;
    }
    return false;
},
toJson : function () {
    const user = this.toObject();
    delete user.password;
    return user;
    
}
}

module.exports =mongoose.model('users', UserSchema)