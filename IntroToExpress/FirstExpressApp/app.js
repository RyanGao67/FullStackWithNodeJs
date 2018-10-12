var express = require("express");

var app = express();

//"/"=>"Hi there"
//"/bye"=>"Goodbye"

app.get("/", function(req, res){
   res.send("Hi there!"); 
});


app.listen(process.env.PORT, process.env.IP);