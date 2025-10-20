const User= require("../models/user"); 

module.exports.renderSignupForm= (req, res)=>{
    // res.render("/users/signup.ejs");
    res.render("users/signup");
};

module.exports.signup=async(req, res)=>{
    try{
        let {username, email, password}=req.body;
    const newuser= new User({email, username});
    const registerdUser=await User.register(newuser, password);
    console.log(registerdUser);
    req.login(registerdUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to wanderLust!");
    res.redirect('/listings');
    })
    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm=async(req, res)=>{
   req.flash("success","Welcome to WanderLust! You are logged in!");
   let redirectUrl=res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
    
};

module.exports.login=(req, res)=>{
    // res.render("/users/signup.ejs");
    res.render("users/login");

};

module.exports.logout=(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
    })
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
};