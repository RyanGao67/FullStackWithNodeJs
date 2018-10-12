var express = require("express");
var request = require("request");

var app = express();
app.set("view engine", "ejs");
app.get("/", function(req, res){
    res.render("search");
});
app.get("/requests",function(req, res){
      console.log(req.query.search);
      request("http://www.omdbapi.com/?s=california&apikey=thewdb",function(error, response, body){
          if(!error && response.statusCode == 200){
              var result = JSON.parse(body);
              res.render("results", {data: result});
          }
      });
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("file app is running?");
});