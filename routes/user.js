const express=require("express");
const router=express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../views/middleware.js");

const userController = require("../controllers/users.js");


//Get SignUp
router.
route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync(userController.signup));


router.
route("/login")
.get( userController.login )
.post(
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:'/login', failureFlash:true}), userController.renderLoginForm 
);

router.get("/logout", userController.logout);

module.exports=router;