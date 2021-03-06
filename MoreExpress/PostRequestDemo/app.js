var express = require("express");

var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var friends = ["Tony", "Miranda", "Justin", "Pierre", "Lily"];


app.get("/", function(req, res){
    res.render("home.ejs");    
});

app.get("/friends", function(req, res){
    res.render("friends.ejs", {friends:friends});
});

app.post("/addfriend", function(req, res){
    var newfriend = req.body.newfriend;
    friends.push(newfriend);
    res.redirect("/friends");
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is started");
});