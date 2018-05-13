var express                 = require('express'),
    expressSanitizer        = require("express-sanitizer"),
    bodyParser              = require("body-parser"),
    app                     = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //MUST GO AFTER BODY PARSER 

// All middleware goes here 
var middlewareObj = {}; 


//custom middleware to sanitize manual html and js input
middlewareObj.sanitize = function (req, res, next) {
    try {
        // if (req.body.coverLetter){
        //     //Sanitize cover letter input
        //     req.body.coverLetter.title = req.sanitize(req.body.coverLetter.title);
        //     req.body.coverLetter.body = req.sanitize(req.body.coverLetter.body);
        //     return next();
        // } else if (req.body.reference){
            
        //     return next();
        // } else if (req.body.resume){
            
        //     return next();
        // }
            return next();
    } catch (ex){
        console.log(ex);
    }
      
}; 

module.exports = middlewareObj; 