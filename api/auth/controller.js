const User = require ('../users/model')
const jwt = require("jsonwebtoken");
exports.register =  async(req, res)=>{
    try{
        const user = new User(req.body);
        user.created= new Date();
        user.modified=new Date();
        const newSave = await user.save();
        const token = signToken(newSave)
        const returnUser = {
            firstName: newSave.firstName,
            lastName: newSave.lastName,
            email: newSave.email,
            role: newSave.role
        }
      return   res.status(201).json({
            message: 'User created successfully',
            data: returnUser, token
        });
    }
    catch(err){
        res.status(400).json({
            message: err.message
        });
    }
}

exports.logIn = async (req,res)=>{
    // let {email, password} = req.body; es lo mismo que lo que esta abajo
    let email= req.body.email;
    let password= req.body.password;
    if (!email || !password){
        res.status(400).json({
            status: "fail",
            message: "please provide email and password",
          });
    }
    const userExist = await User.findOne({email: email});
    if (!userExist|| !userExist.authenticate(password)) {
       return res.status(404).json({
            status: "fail",
            message: "Invalid credentials",
          });
    }
    
    const returnUser = {
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        email: userExist.email,
        role: userExist.role
    }
    const token = signToken(userExist)
   return   res.status(200).json({
        status: "success",
        data: userExist,
        token,
        data:
          returnUser
        
      });

}

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