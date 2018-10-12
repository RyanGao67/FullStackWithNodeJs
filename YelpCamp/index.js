var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

var Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    //User = require("./models/user"),
    seedDB = require("./seeds");
    

seedDB();


app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
      // get all campgrounds from db
      Campground.find({}, function(err, allCampgrounds){
          if(err){
              console.log(err);
          }else{
              res.render("campgrounds/index", {campgrounds:allCampgrounds});
          }
      });
      //res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page
    var name  = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:image, description:desc};
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
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
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


//===============
//COMMENTS ROUTES
//===============

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp has started");
});


// INDEX /campgrounds
// NEW   /campgrounds/new
// CREATE /campgrounds
// SHOW   /campgrounds/:id

// NEW campgrounds/:id/comments/new
// CREATE campgrounds/:id/comments  post
