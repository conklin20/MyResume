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

const rootUrl = '/api/u/:userId/b';

// SHOW/Render Routes will NOT use the API convention 

// GET ALL USER BUNDLES
router.get(rootUrl, middleware.isAccountOwner, function(req, res){

});

// CREATE NEW BUNDLE
router.post(rootUrl, middleware.isAccountOwner, function(req, res){

});

// DELETE BUNDLE
router.delete(rootUrl, middleware.isAccountOwner, function(req, res){

});

module.exports = router; 