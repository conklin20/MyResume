var express             = require("express"),
    User                = require("../../models/users"),
    CoverLetter         = require("../../models/coverletters"),
    authMiddleware      = require("../../middleware/auth.js"),
    // sanitizeMiddleware  = require("../../middleware/sanitize.js"),
    router              = express.Router();

// **********************
// COVER LETTER ROUTES
// These ROUTES follow the REST pattern
// **********************

// SHOW/Render Routes will NOT use the API convention 

const rootUrl = '/api/u/:userId/cl';

// CREATE
router.post(rootUrl, authMiddleware.isAccountOwner, function(req, res){
    //lookup the user 
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/u/" + req.params.userId); 
        } else {
            //Save the CoverLetter to the DB
            CoverLetter.create(req.body.coverLetter, function(err, coverLetter) {
                if (err) {
                    console.log(err); 
                    // req.flash('error', err.message);
                    res.redirect("/u/" + req.params.userId); 
                } else {
                    //save cover letter
                    coverLetter.save(); 
                    
                    //push the cover letter ref into the user array 
                    foundUser.coverLetters.push(coverLetter._id);
                    foundUser.save();
                    
                    res.redirect('/u/' + req.params.userId);
                }
            });
        }
    }); 
});

// UPDATE
router.put(rootUrl + '/:clID', authMiddleware.isAccountOwner,  function(req, res){
    //lookup and update cover letter
    CoverLetter.findByIdAndUpdate(req.params.clID, req.body.coverLetter, function(err, updatedCL){
        if(err){
           console.log(err); 
           res.redirect("/u/" + req.params.userId); 
        } else {
            res.redirect('/u/' + req.params.userId); 
        }
    }); 
});

// DESTROY 
router.delete(rootUrl + '/:clID', authMiddleware.isAccountOwner, function(req, res){
    //find user
    User.findById(req.params.userId, function(err, foundUser){
        if (err){
            console.log(err); 
            res.redirect("/u/" + req.params.userId); 
        } else {
            //delete the Cover Letter
            CoverLetter.findByIdAndRemove(req.params.clID, function(err){
            if(err){
                console.log(err); 
                res.redirect('/u/' + req.params.userId); 
            } else {
                //remove the CL reference from the user document 
                foundUser.coverLetters.splice(foundUser.coverLetters.indexOf(req.params.clID), 1);
                foundUser.save();
                // res.redirect('/u/' + req.params.userId);
                res.status(200).json({ data: foundUser.coverLetters });
            }
          });
        }
    }); 
});

// EDIT
router.get('/u/:userId/cl/:clId/edit', authMiddleware.isAccountOwner, function(req, res){
   //lookup the cover letter 
   CoverLetter.findById(req.params.clId, function(err, foundCL){
       if(err){
            console.log(err); 
            res.redirect("/u/" + req.params.userId); 
       } else {
            //render the edit page and send the cl to it
            res.render("cover-letter-edit", { userId: req.params.userId, coverLetter: foundCL }); 
       }
   }); 
});

// NEW
router.get('/u/:userId/cl/new', authMiddleware.isAccountOwner, function(req, res){
    res.render('cover-letter', { userId: req.params.userId }); 
});

module.exports = router;