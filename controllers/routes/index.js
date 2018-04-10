var express         = require("express"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    CoverLetter     = require("../../models/coverletters"),
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
        Resume.findById(req.params.resumeID, function(err, foundResume){
        if(err){
            console.log(err);
        } else {
            res.render('index', { user: foundUser, resume: foundResume, coverLetter: null }); 
        }
        }); 
    }
    }); 
});

// SHOW - SHOWING A COVERLETTER AS WELL
router.get('/myresume/:userID/:resumeID/:coverLetterID', function(req, res) {
    //find the user in the DB 
    User.findById(req.params.userID, function(err, foundUser){
    if(err){
        console.log(err); 
    } else {
        //find the resume in the DB 
        Resume.findById(req.params.resumeID, function(err, foundResume){
        if(err){
            console.log(err);
        } else {
            CoverLetter.findById(req.params.coverLetterID, function(err, foundCL) {
                if(err){
                    console.log(err);
                } else {
                    res.render('index', { user: foundUser, resume: foundResume, coverLetter: foundCL });
                }
            });
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

