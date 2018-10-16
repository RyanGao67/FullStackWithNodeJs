var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment");
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req,res){
    res.render("landing");
});





//===========
//AUTH ROUTES
//show the register form
router.get("/register", function(req, res){
    res.render("register");
});
router.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    
    User.register(newUser, req.body.password, function(err, user){
        
        if(err){
            req.flash("error", err)
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp"+user.username);
            res.redirect("/campgrounds");
        });
    });
    // res.send("Signing you up");
});

router.get("/login", function(req,res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req, res){
 
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});



function isLoggedIn(req, res, next){
    if(req.isAuthentiated()){
        return next();
    }
    res.redirect("/login");
}

module.exports =router;