var express         = require("express"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    middleware      = require("../../middleware/auth.js"),
    router          = express.Router();

// **********************
// RESUME ROUTES
// These ROUTES follow the REST pattern
// **********************

// Route    URL               Verb    Purpose                   Mongoose Method
// -----------------------------------------------------------------------------
// INDEX    
// NEW      /new              GET     Show new resume form      N/A
// CREATE   /                 POST    Create new resume in db   Resume.create()       
// SHOW     
// UPDATE   
// EDIT     
// DESTROY  


// NEW
router.get('/:userID/new', function(req, res){
  //find the user in the DB 
  User.findById(req.params.userID, function(err, user){
    if(err){
      console.log(err); 
    } else {
      res.render('resume', { user: user });
    }
  }); 
});

// CREATE
router.post('/:userID', /*implement middleware*/ function(req, res){
  //Save the Resume to the DB
  eval(require("locus"))
  Resume.create(req.body.resume, function(err, user) {
      if (err) {
          console.log(err); 
          // req.flash('error', err.message);
          return res.redirect('back');
      }
      res.redirect('/' + user.id);
  });
});

module.exports = router; 