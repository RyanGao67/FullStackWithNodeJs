var exp = require("express");
var app = exp();

app.get("/",function(req,res){
    res.send("Hi there welcome to my assignment");
});

app.get("/speak/pig", function(req,res){
    res.send("The pig says 'Oink'");
});

app.get("/:word/:number", function(req,res){
    var word = req.params.word;
    var number = req.params['number'];
    var returnresult = "";
    for(var i =0;i<number;i++){
        returnresult+=(word+" ");
    }
    res.send(returnresult);
})
app.listen(process.env.PORT, process.env.IP);