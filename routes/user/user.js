var express         = require("express"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    CoverLetter     = require("../../models/coverletters"),
    Reference       = require("../../models/references"),
    middleware      = require("../../middleware/auth.js"),
    async           = require("async"),
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
  
  User.create(newUser, function(err, user) {
      if (err) {
          console.log(err); 
          // req.flash('error', err.message);
          return res.redirect('back');
      }
      res.redirect('u/' + user.id);
  });
    
}); 

// UPDATE 
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

// DELETE
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

// GET ALL USER COVER LETTERS
router.get(rootUrl+'/:userId/cl', middleware.isAccountOwner, function(req, res) {
  //find the user in the DB 
  User.findById(req.params.userId).
    populate("coverLetters").
    exec(function(err, data){
      if(err){
        console.log(err); 
      } else {
        res.status(200).json({ data: data.coverLetters });
      }
    }); 
});

// GET ALL USER REFERENCES
router.get(rootUrl+'/:userId/ref', middleware.isAccountOwner, function(req, res) {
  //find the user in the DB   
  User.findById(req.params.userId).
    populate("references").
    exec(function(err, data){
      if(err){
        console.log(err); 
      } else {
        res.status(200).json({ data: data.references });
      }
    }); 
});

// SHOW
router.get('/u/new', middleware.ensureAuthenticated, function(req, res){
  res.render('user-new', { user: req.user });
});

// SHOW
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

// SHOW (VIA LINKEDIN USER ID)
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

// SHOW EDIT FORM
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