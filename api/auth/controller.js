const User = require ('../users/model')
const jwt = require("jsonwebtoken");
const path = require('path');
exports.register = async (req, res) => {
    try {
      const user = new User(req.body);
      user.created = new Date();
      user.modified = new Date();

      if (req.file) {
        user.avatar = path.join('/uploads', req.file.filename);
    }
      const newSave = await user.save();
      const token = signToken(newSave);
      const returnUser = {
        firstName: newSave.firstName,
        lastName: newSave.lastName,
        email: newSave.email,
        role: newSave.role,
        birthday: newSave.birthday,
        avatar: newSave.avatar,
        id: newSave.id
      };
      return res.status(201).json({
        message: 'User created successfully',
        data: returnUser,
        token,
      });
    } catch (err) {
      const errorCode = err.code || 400;
      res.status(errorCode).json({
        code: err.code,
        message: err.message,
      });
    }
  };

exports.logIn = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password",
            });
        }

        const userExist = await User.findOne({ email: email });

        if (!userExist || !userExist.authenticate(password)) {
            return res.status(404).json({
                status: "fail",
                message: "Invalid credentials",
            });
        }

        const returnUser = {
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            email: userExist.email,
            birthday: userExist.birthday,
            role: userExist.role,
            id: userExist.id,
            avatar: userExist.avatar
        };

        const token = signToken(userExist);

        return res.status(200).json({
            status: "success",
            data: returnUser,
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error occurred during login",
            error: error.message
        });
    }
};

const signToken = (user)=>{
    return jwt.sign({sub: user.id, email:user.email},"mysecret", {});
}

exports.isLandlord = async (req , res , next)=>{
    const role = req.user.role ;
    if (role === 'landlord' || role === 'admin'){
        return next()  
    }
    else{
        res.status(403).json({
            status: 'fail' ,
            message: 'Error'
        })
    }
    
}
exports.isAdmin = (req, res, next) => {
    const role = req.user.role;
    if (role === 'admin') {
        return next() ;
    } else {
        return res.status(403).json({
            status: 'fail',
            message: 'Admin access denied'
        });
    }
}