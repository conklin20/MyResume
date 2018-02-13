var express         = require("express"),
    router          = express.Router()

// **********************
// ROUTES - INDEX
// These ROUTES follow the REST pattern
// **********************
router.get('/', function(req, res){
  res.render('index', { user: req.user });
});

// CREATE ROUTE


module.exports = router; 