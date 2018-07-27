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

const rootUrl = '/api/u';

// SHOW/Render Routes will NOT use the API convention 

// CREATE USER
router.post(rootUrl, middleware.ensureAuthenticated, function(req, res){
  var newUser = {
      //LinkedIn Fields
      linkedinUsername: req.body.user.linkedinUsername, 
      linkedinFirstName: req.body.user.linkedinFirstName, 
      linkedinLastName: req.body.user.linkedinLastName, 
      linkedinEmail: req.body.user.linkedinEmail,
      linkedinURL: req.user._json.publicProfileUrl, 
      linkedinID: req.user.id, 
      //Custom fields
      username: req.body.user.username,
      phone: req.body.user.phone, 
      city: req.body.user.city, 
      state: req.body.user.state,
      avatar: req.body.user.avatar, 
      facebookURL: req.body.user.facebookURL,
      instagramURL: req.body.user.instagramURL, 
      twitterURL: req.body.user.twitterURL, 
      githubURL: req.body.user.githubURL
  };
  
  User.create(newUser, function(err, newUser) {
      if (err) {
          console.log(err); 
          // req.flash('error', err.message);
          return res.redirect('back');
      }
      res.redirect('/u/' + newUser.id);
  });
    
}); 

// UPDATE USER
router.put(rootUrl+'/:userId', middleware.isAccountOwner, function(req, res){
  User.findByIdAndUpdate(req.params.userId, req.body.user, function(err, updatedUser){
    if(err){
      console.log(err); 
    } else {
      // save defaults
      updatedUser.defaults.resume         = req.body.defaults.resume; 
      updatedUser.defaults.coverLetter    = req.body.defaults.coverLetter; 
      updatedUser.defaults.printTheme     = req.body.defaults.printTheme;
      updatedUser.defaults.printFontSize  = req.body.defaults.printFontSize;
      
      updatedUser.save(); 
      
      res.redirect('/u/' + req.params.userId);
    }
  });
});

// DELETE USER
router.delete(rootUrl+'/:userId', middleware.isAccountOwner, function(req, res){
  //delete the user
  User.findByIdAndRemove(req.params.userId, function(err, foundUser){
    if(err){
      console.log(err); 
        res.redirect("/"); 
    } else {
        //delete data associated to the user 
        foundUser.resumes.forEach(function(resume){
          Resume.findByIdAndRemove(resume, function(err){
            if(err){
              console.log(err); 
            }
          }); 
        }); 
        foundUser.coverLetters.forEach(function(cl){
          CoverLetter.findByIdAndRemove(cl, function(err){
            if(err){
              console.log(err);
            }
          }); 
        }); 
        foundUser.references.forEach(function(reference){
          Reference.findByIdAndRemove(reference, function(err){
            if(err){
              console.log(err); 
            }
          }); 
        }); 
      
        //log user out
        req.logout();
        //redirect
        res.redirect("/login"); 
    }
  });
});

// GET ALL USER RESUMES
router.get(rootUrl+'/:userId/r', middleware.isAccountOwner, function(req, res) {
      //find the user in the DB 
  User.findById(req.params.userId).
    populate("resumes").
    exec(function(err, data){
      if(err){
        console.log(err); 
      } else {
        res.status(200).json({ data: data.resumes });
      }
    }); 
});

module.exports = router; 