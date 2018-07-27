var express             = require("express"),
    User                = require("../../../models/users"),
    CoverLetter         = require("../../../models/coverletters"),
    authMiddleware      = require("../../../middleware/auth.js"),
    // sanitizeMiddleware  = require("../../middleware/sanitize.js"),
    router              = express.Router();

// **********************
// COVER LETTER ROUTES
// These ROUTES follow the REST pattern
// **********************

// SHOW/Render Routes will NOT use the API convention 

// EDIT
router.get('/u/:userId/cl/:clId/edit', authMiddleware.isAccountOwner, function(req, res){
   //lookup the cover letter 
   CoverLetter.findById(req.params.clId, function(err, foundCL){
       if(err){
            console.log(err); 
            res.redirect("/u/" + req.params.userId); 
       } else {
            //render the edit page and send the cl to it
            res.render("cover-letter-edit", { userId: req.params.userId, coverLetter: foundCL }); 
       }
   }); 
});

// NEW
router.get('/u/:userId/cl/new', authMiddleware.isAccountOwner, function(req, res){
    res.render('cover-letter', { userId: req.params.userId }); 
});

module.exports = router;