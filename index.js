const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require('./api/users/model');

const app = express();

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'mysecret';


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    try {
        const user = User.findById( jwt_payload.sub);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }catch (error) {
        return done(error, false);
    }
}));

const key =
  "mongodb+srv://jlrodriguez:sixqMkLySebh0Fe6@cluster0.vamq1s5.mongodb.net/FlatsNodeJs?retryWrites=true&w=majority&appName=Cluster0";

const OPT = {
  useNewUrlParser: true,
};

const authRoutes = require('./api/auth/routes')
const userRoutes = require('./api/users/routes')

app.use("/users", authRoutes);
app.use("/users", userRoutes);



mongoose.connect(key, OPT);

app.listen(3001);       