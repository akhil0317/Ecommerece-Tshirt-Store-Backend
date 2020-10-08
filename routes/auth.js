var express = require("express");
var router = express.Router();
const {signout, signup,signin,isSignedIn} =require("../controllers/auth")
const {check} = require("express-validator")

router.post("/signup",[
check("name").isLength({min:3}).withMessage("name should be atleast 3 charecter long!"),
check("email").isEmail().withMessage("email is required and should be valid email"),
check("password").isLength({min:3}).withMessage("password should be atleast 3 charecters long!")
], signup)

router.post("/signin",[
   
    check("email").isEmail().withMessage("email is required and should be valid email"),
    check("password").isLength({min:1}).withMessage("password is required ")
    ], signin)

router.get("/signout", signout)

router.get("/testroute",isSignedIn,(req,res)=>{
    res.send("A protected Route")
})



module.exports = router;
