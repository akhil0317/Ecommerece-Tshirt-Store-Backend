const User = require("../models/user");
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt");
exports.signup = (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
const user = new User(req.body)
user.save((err,user)=>{
if(err){
    return res.status(400).json({
        err:"Not able to save user in DB"
    })
}
res.json({
    name:user.name,
    email:user.email,
    id:user._id
})
})
}

exports.signin = (req,res)=>{
    const errors = validationResult(req)
    const {email,password} = req.body;
   
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }


    User.findOne({email},(err,user)=>{
        if(err||!user)
        {
            
           return  res.status(400).json({
                error:"User email does not exsist"
            })
        }
        if(!user.authenticate(password))
        {
             return res.status(401).json({
                error:"Email and password do not match"
            })
        }
        const {_id,email,name,role} = user

        //create a token
     const token =    jwt.sign({_id:user._id},process.env.SECRET,{
         expiresIn:"3 hours"
     })

        //put token in cookie
         res.cookie("token",token)

        //send response to frontend
         return res.json({token,user:{_id,name,email,role}})
    })
   
   
}

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"User signout successfully!!"
    })
}
//protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty:"auth"
})


//custom middlewares

exports.isAuthenticated = (req,res,next)=>{
    console.log("isauthenticated")
    console.log("req.profile",req.profile)
    console.log("auth",req.auth)
    console.log("auth_id",req.auth._id)
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker)
    {
        return res.status(403).json({
            error:"ACCESS DENIED"
        })
    }
    next();
}


exports.isAdmin = (req,res,next)=>{
    if(req.profile.role===0){
        return res.status(403).json({
            error:"You are not ADMIN, Access Denied"
        })
    }
    next();
}