var User = require('../models/users');

// All middleware goes here 
var middlewareObj = {}; 

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
middlewareObj.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

//custom middleware
middlewareObj.isAccountOwner = function (req, res, next) {
  if (req.isAuthenticated()){
    User.findById(req.params.userId, function(err, foundUser){
      if(err){
        req.flash('error', 'Redirect to error page: error looking up user');
        res.redirect('back'); 
      } else {
        //check for ownership
        if((foundUser.linkedinID && foundUser.linkedinID === req.user.id) || res.locals.testing === true){
          return next();
        } else {
          req.flash('error', 'Redirect to error page: user doesnt own this profile and cannot access this page');
          res.redirect('back'); 
        }
      }  
    });
  } else {
    req.flash('error', 'Redirect to error page: user is not authenticated');
    res.redirect('back'); 
  }
}; 

module.exports = middlewareObj; 