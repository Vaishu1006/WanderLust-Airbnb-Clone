if(process.env.NODE_ENV!= "production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const session = require("express-session");
const MongoStore=require("connect-mongo");

const path=require("path");
const methodOverride=require("method-override");

const dbUrl=process.env.ATLASDB_URL;

const ejsMate=require("ejs-mate");
const flash = require("connect-flash");

const ExpressError=require("./utils/ExpressError.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");


main()
.then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

store.on("error", (err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 1000,
        maxAge:7 * 24 * 60 * 1000,
        httpOnly: true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res)=>{
//     console.log("Hi, I am root");
// });

// app.use(session(sessionOptions));
// app.use(flash());

app.use((req, res, next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser", async(req, res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com"
//     });
//     let registeredUser=await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Recommended
app.use((req, res) => {
  res.status(404).send('Page not found');
});

//middleware
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("sever is listening to 8080");
});

