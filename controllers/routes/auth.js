var express         = require("express"),
    passport        = require("passport"),
    router          = express.Router();

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
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/'); 
  });

router.get('/login', function(req, res){
  res.render('login');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});


module.exports = router; 