"use strict";
var fs = require("fs");
var autorem = require("./lib/autorem");
var css = fs.readFileSync("./example.css", "utf8");
var processedCss = autorem.process(css);

fs.writeFile("example.processed.css", processedCss, function(err){
	if(err){
		throw err;
	}
});