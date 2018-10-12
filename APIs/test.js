var express = require("express");
var app = express();
express.static(__dirname+"/public");
console.log(__dirname);
