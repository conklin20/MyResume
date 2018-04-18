var express         = require("express"),
    User            = require("../../models/users"),
    // Resume          = require("../../models/resumes"),
    // CoverLetter     = require("../../models/coverletters"),
    // Reference       = require("../../models/references"),
    middleware      = require("../../middleware/auth.js"),
    router          = express.Router();

// **********************
// USER ROUTES
// These ROUTES follow the REST pattern
// **********************

// Route    URL               Verb    Purpose                   Mongoose Method
// -----------------------------------------------------------------------------
// INDEX    /                 GET     Redirect user accordingly N/A
// NEW      /new              GET     Show new user form        N/A
// CREATE   /                 POST    Create new user in db     User.create()       
// SHOW     /:userID          GET     Show User Info            User.findById()
// UPDATE   /:userID          PUT     Update user info in db    User.findByIdAndUpdate()
// EDIT     /:userID/edit     GET     Show user edit form       User.findById()
// DESTROY  /:userID          DELETE  Delete a user             User.findByIdAndRemove()

// INDEX
router.get('/user', function(req, res){
  if (res.locals.testing){
    req. flash("error", "**In Test Mode!**"); 
  }
  
});

// NEW
router.get('/user/new', middleware.ensureAuthenticated, function(req, res){
  res.render('userNew', { user: req.user });
});

// CREATE 
router.post("/user", middleware.ensureAuthenticated, function(req, res){
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
      res.redirect('user/' + user.id);
  });
    
}); 

// SHOW
router.get('/user/:userID', middleware.isAccountOwner, function(req, res){
  //find the user in the DB 
  User.findById(req.params.userID).
    populate("resumes").
    populate("coverLetters").
    populate("references").
    exec(function(err, foundUser){
      if(err){
        console.log(err); 
      } else {
        //eval(require("locus"))
        res.render('user', { user: foundUser });
      }
    }); 
});

// EDIT 
router.get('/user/:userID/edit', middleware.isAccountOwner, function(req, res) {
  //find the user in the DB 
  User.findById(req.params.userID, function(err, user){
    if(err){
      console.log(err); 
    } else {
      //get other user related info 
      // Resume.find({userID: user.Id}, function(err, resumes){
        
      // }); 
      res.render('userEdit', { user: user });
    }
  }); 
});

// UPDATE
router.put('/user/:userID', middleware.isAccountOwner, function(req, res){
  User.findByIdAndUpdate(req.params.userID, req.body.user, function(err, updatedUser){
    if(err){
      console.log(err); 
    } else {
      res.redirect('/user/' + req.params.userID); 
    }
  }); 
});

// DELETE
router.delete('/user/:userID', middleware.isAccountOwner, function(req, res){
  //delete data associated to the user 
  // Resume.find({ id:333 }).remove().exec();
  //NEED TO COMPLETE THIS
  //delete the user
  User.findByIdAndRemove(req.params.userID, function(err){
    if(err){
      console.log(err); 
        res.redirect("/"); 
    } else {
        //log user out
        req.logout();
        //redirect
        res.redirect("/"); 
    }
  });
});


module.exports = router; 