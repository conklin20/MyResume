var express         = require("express"),
    router          = express.Router(), 
    middleware      = require("../../middleware/auth.js");

// **********************
// ROUTES - Account
// These ROUTES follow the REST pattern
// **********************
router.get('/account', middleware.ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});



module.exports = router; 