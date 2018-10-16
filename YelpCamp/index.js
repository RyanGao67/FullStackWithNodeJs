var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

var flash  = require("connect-flash");
app.use(flash());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

var Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");
    

// seedDB();

var passport  = require("passport"),
    LocalStrategy = require("passport-local")
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

function isLoggedIn(req, res, next){
    if(req.isAuthentiated()){
        return next();
    }
    res.redirect("/login");
}


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp has started");
});
// INDEX /campgrounds
// NEW   /campgrounds/new
// CREATE /campgrounds
// SHOW   /campgrounds/:id

// NEW campgrounds/:id/comments/new
// CREATE campgrounds/:id/comments  post
