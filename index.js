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

const key ="mongodb+srv://jlrodriguez:sixqMkLySebh0Fe6@cluster0.vamq1s5.mongodb.net/FlatsFINDER?retryWrites=true&w=majority&appName=Cluster0"
const OPT = {
  useNewUrlParser: true,
};

const favoriteRoutes = require('./api/favorites/favoriteRoutes')
const authRoutes = require('./api/auth/routes')
const userRoutes = require('./api/users/routes')
const flatsRoutes = require('./api/flats/routes')
const messageRouter = require('./api/messages/routes')

app.use("/users", authRoutes);
app.use("/users", userRoutes);
app.use("/flats", flatsRoutes);
app.use("/favorites", favoriteRoutes);
app.use('/messages', messageRouter); 



mongoose.connect(key, OPT);
    
app.listen(3001);       