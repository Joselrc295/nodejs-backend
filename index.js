const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const User = require('./api/users/model');

const app = express();
app.use(express.json())
app.use(cors())

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'mysecret';


passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await User.findById( jwt_payload.sub);
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

const key = "mongodb+srv://edavila:c3G2XQi33BmwpYDM@cluster0.3nhzhkn.mongodb.net/FlatFinder?retryWrites=true&w=majority&appName=Cluster0"
const OPT = {
  useNewUrlParser: true,
};

const authRoutes = require('./api/auth/routes')
const userRoutes = require('./api/users/routes')
const flatsRoutes = require('./api/flats/routes')

app.use("/users", authRoutes);
app.use("/users", userRoutes);
app.use("/flats", flatsRoutes)



mongoose.connect(key, OPT);

app.listen(3001);       