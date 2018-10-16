var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
router.get("/", function(req, res){
      // get all campgrounds from db
      Campground.find({}, function(err, allCampgrounds){
          if(err){
              console.log(err);
          }else{
              res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
          }
      });
      //res.render("campgrounds", {campgrounds:campgrounds});
});

router.post("/", middleware.isLoggedIn,function(req, res){
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page
    var name  = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, image:image, description:desc, author: author};
    // Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req,res){
    //find the campground with provide ID
    //render show twmplate with that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.post("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds")
       }
   });
});

router.get("/:comment_id/edit", function(req, res){
    res.send("EDIT ROUTE ");
});


module.exports=router;