var express         = require("express"),
    passport        = require("passport"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    router          = express.Router();

// INDEX 
router.get('/', function(req, res) {
  if (req.headers.host === 'www.caryconklin.com') {
    User.findOne({username: 'cary' }, function(err, foundUser){
      if(err){
          console.log(err); 
      } else {
          //find the resume in the DB
          if(foundUser) {
              if(foundUser.resumes.length > 0){
                  Resume.findById(foundUser.defaults.resume, function(err, foundResume){
                      if(err){
                          console.log(err);
                      } else {
                          res.render('index', { user: foundUser, resume: foundResume, coverLetter: null }); 
                      }
                  }); 
              }
          }
      }
    });
  } else {
    ///me/MyResume/views/user/login.ejs
    res.render('login');
  }
}); 

// GET /auth/linkedin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Linkedin authentication will involve
//   redirecting the user to linkedin.com.  After authorization, Linkedin
//   will redirect the user back to this application at /auth/linkedin/callback
var state = "dsadh23hrioghwrg";
router.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: state }),
  function(req, res){
    // The request will be redirected to Linkedin for authentication, so this
    // function will not be called.
  });

// GET /auth/linkedin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route functionexit function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res){
    try {
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
              //if not, reirect to sign up page
              res.redirect('/u/new');
            }
          }
        }); 
      } else {
        res.redirect('/login');
      }
    } catch (ex) {
      console.log(ex); 
    }
  });
  
function findUserByLinkedIn(linkedInUserId){
  User.findOne({ linkedinID: linkedInUserId }, function(err, foundUser){
    if(err){
      console.log(err); 
    }
    return foundUser; 
  }); 
}

router.get('/login', function(req, res){
  res.render('login');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


module.exports = router; 