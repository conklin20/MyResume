var express         = require("express"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    CoverLetter     = require("../../models/coverletters"),
    middleware      = require("../../middleware/auth.js"),
    router          = express.Router();
    

// Route    URL               Verb    Purpose                   Mongoose Method
// -----------------------------------------------------------------------------
// INDEX    /                 GET     Redirect user accordingly N/A
// NEW      
// CREATE         
// SHOW     /:userID          GET     Show Resume               Resume.findById()
// UPDATE   
// EDIT     
// DESTROY  


// SHOW 
router.get('/myresume/:userID/:resumeID', function(req, res) {
    //find the user in the DB 
    User.findById(req.params.userID, function(err, foundUser){
    if(err){
        console.log(err); 
    } else {
        //find the resume in the DB 
        // Resume.findById(req.params.resumeID, function(err, foundResume){
        // if(err){
        //     console.log(err);
        // } else {
            
        //     res.render('index', { user: foundUser, resume: foundResume }); 
        // }
        // }); 
        Resume.findById(req.params.resumeID). 
        populate('timeline').
        sort({date: 'asc'}).
        exec(function(err, foundResume){
        if(err){
            console.log(err);
        } else {
            
            res.render('index', { user: foundUser, resume: foundResume }); 
        }
        });
    }
    }); 
});

// THIS IS TO SHORT CIRCUIT AN ANNOYING BUG WHERE EXPRESS TRIES TO REDIRECT TO /favicon/ico
router.get('/favicon.ico', function(req, res) {
    res.status(204);
});


module.exports = router; 

