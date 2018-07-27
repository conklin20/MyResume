var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    CoverLetter     = require("../../../models/coverletters"),
    Reference       = require("../../../models/references"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

// **********************
// USER ROUTES
// These ROUTES follow the REST pattern
// **********************


// SHOW NEW USER FORM
router.get('/u/new', middleware.ensureAuthenticated, function(req, res){
  res.render('user-new', { user: req.user });
});

// SHOW USER PROFILE PAGE
router.get('/u/:userId', middleware.isAccountOwner, function(req, res){
  //find the user in the DB 
  User.findById(req.params.userId).
    populate("resumes").
    populate("coverLetters").
    populate("references").
    exec(function(err, foundUser){
      if(err){
        console.log(err); 
      } else {
        res.render('user', { user: foundUser });
      }
    }); 
});

// SHOW USER PROFILE PAGE (VIA LINKEDIN USER ID)
router.get('/linkedin/:userId', function(req, res){
  //check if user is in db, using the LinkedIn ID field
  if(req.user){
    User.findOne({ linkedinID: req.user.id }, function(err, foundUser){
      if(err){
        console.log(err); 
      } else {
        if (foundUser){
          //if so, redirect to show page
          res.redirect('/u/' + foundUser._id);
        } else {
          res.redirect('/');
        }
      }
    }); 
  }
});

// SHOW USER EDIT FORM
router.get('/u/:userId/edit', middleware.isAccountOwner, function(req, res) {
  //find the user in the DB 
  User.findById(req.params.userId, function(err, user){
    if(err){
      console.log(err); 
    } else {
      res.render('user-edit', { user: user });
    }
  }); 
});

module.exports = router; 