var express         = require("express"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    CoverLetter     = require("../../models/coverletters"),
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
router.get('/', function(req, res){
  if (res.locals.testing){
    req. flash("error", "**In Test Mode!**"); 
  }
  
  //check if user is in db, using the LinkedIn ID field
  if(req.user){
    User.findOne({ linkedInID: req.user.id }, function(err, foundUser){
      if(err){
        console.log(err); 
      } else {
        if (foundUser){
          //if so, redirect to show page
          res.redirect('/' + foundUser._id);
        } else {
          //if not, reirect to sign up page
          res.redirect('/new');
        }
      }
    }); 
  } else {
    res.redirect('/auth/linkedin'); 
  }
});

// NEW
router.get('/new', middleware.ensureAuthenticated, function(req, res){
  res.render('register', { user: req.user });
});

// CREATE 
router.post("/", middleware.ensureAuthenticated, function(req, res){
  var newUser = {
      //LinkedIn Fields
      username: req.body.user.username, 
      firstName: req.body.user.firstName, 
      lastName: req.body.user.lastName, 
      email: req.body.user.email,
      linkedInURL: req.user._json.publicProfileUrl, 
      linkedInID: req.user.id, 
      //Custom fields
      phone: req.body.user.phone, 
      avatar: req.body.user.avatar, 
      bannerImg: req.body.user.bannerImg, 
      //elevatorPitch: req.body.user.elevatorPitch
  };
  //Save the user to the DB
  User.create(newUser, function(err, user) {
      if (err) {
          console.log(err); 
          // req.flash('error', err.message);
          return res.redirect('back');
      }
      res.redirect('/' + user.id);
  });
}); 

// SHOW
router.get('/:userID', middleware.isAccountOwner, function(req, res){
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
router.get('/:userID/edit', middleware.isAccountOwner, function(req, res) {
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
router.put('/:userID', middleware.isAccountOwner, function(req, res){
  User.findByIdAndUpdate(req.params.userID, req.body.user, function(err, updatedUser){
    if(err){
      console.log(err); 
    } else {
      res.redirect('/' + req.params.userID); 
    }
  }); 
});

// DELETE
router.delete('/:userID', middleware.isAccountOwner, function(req, res){
  //delete the user
  User.findByIdAndRemove(req.params.userID, function(err){
    if(err){
      console.log(err); 
        res.redirect("/"); 
    } else {
        //redirect
        res.redirect("/"); 
    }
  });
});


module.exports = router; 