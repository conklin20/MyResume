var express             = require("express"),
    User                = require("../../models/users"),
    CoverLetter         = require("../../models/coverletters"),
    authMiddleware      = require("../../middleware/auth.js"),
    sanitizeMiddleware  = require("../../middleware/sanitize.js"),
    router              = express.Router();

// **********************
// RESUME ROUTES
// These ROUTES follow the REST pattern
// **********************

// Route    URL                                 Verb    Purpose                   Mongoose Method
// -----------------------------------------------------------------------------
// INDEX    /:userID                            GET     Shows all CL's for user   N/A
// NEW      /:userID/coverletter/new            GET     Show new CL form          N/A
// CREATE   /:userID/coverletter                POST    Create new CL in db       CoverLetter.create()       
// SHOW     
// UPDATE   /:userID/coverletter/:clID          PUT     Update a CL               CoverLetter.findByIdAndUpdate()
// EDIT     /:userID/coverletter/:clID/edit     GET     Show edit CL form         CoverLetter.findById()
// DESTROY  /:userID/coverletter/:clID          DELETE  delete a CL               CoverLetter.findByIdAndRemove()


// NEW
router.get('/user/:userID/coverletter/new', authMiddleware.isAccountOwner, function(req, res){
    res.render('coverLetter', { userID: req.params.userID }); 
//   //find the user in the DB 
//   User.findById(req.params.userID, function(err, user){
//     if(err){
//       console.log(err); 
//     } else {
//       res.render('resume', { user: user });
//     }
//   }); 
});

// CREATE
router.post('/user/:userID/coverletter', authMiddleware.isAccountOwner, function(req, res){
    //lookup the user 
    User.findById(req.params.userID, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/user/" + req.params.userID); 
        } else {
            //Save the CoverLetter to the DB
            CoverLetter.create(req.body.coverLetter, sanitizeMiddleware.sanitize, function(err, coverLetter) {
                if (err) {
                    console.log(err); 
                    // req.flash('error', err.message);
                    res.redirect("/user/" + req.params.userID); 
                } else {
                    //save cover letter
                    coverLetter.save(); 
                    
                    //push the cover letter ref into the user array 
                    foundUser.coverLetters.push(coverLetter._id);
                    foundUser.save();
                    
                    res.redirect('/user/' + req.params.userID);
                }
            });
        }
    }); 
});

// EDIT
router.get('/user/:userID/coverletter/:clID/edit', authMiddleware.isAccountOwner, function(req, res){
   //lookup the cover letter 
   CoverLetter.findById(req.params.clID, function(err, foundCL){
       if(err){
            console.log(err); 
            res.redirect("/user/" + req.params.userID); 
       } else {
            //render the edit page and send the cl to it 
            res.render("coverLetterEdit", { userID: req.params.userID, coverLetter: foundCL }); 
       }
   }); 
});

// UPDATE
router.put('/user/:userID/coverletter/:clID', authMiddleware.isAccountOwner, sanitizeMiddleware.sanitize, function(req, res){
    //lookup and update cover letter
    CoverLetter.findByIdAndUpdate(req.params.clID, req.body.coverLetter, function(err, updatedCL){
        if(err){
           console.log(err); 
           res.redirect("/user/" + req.params.userID); 
        } else {
            res.redirect('/user/' + req.params.userID); 
        }
    }); 
});

// DESTROY 
router.delete('/user/:userID/coverletter/:clID', authMiddleware.isAccountOwner, function(req, res){
    //find user
    User.findById(req.params.userID, function(err, foundUser){
        if (err){
            console.log(err); 
            res.redirect("/user/" + req.params.userID); 
        } else {
            //delete the Cover Letter
            CoverLetter.findByIdAndRemove(req.params.clID, function(err){
            if(err){
                console.log(err); 
                res.redirect('/user/' + req.params.userID); 
            } else {
                //remove the CL reference from the user document 
                foundUser.coverLetters.splice(foundUser.coverLetters.indexOf(req.params.clID), 1);
                foundUser.save();
                res.redirect('/user/' + req.params.userID);
            }
          });
        }
    }); 
});

module.exports = router; 