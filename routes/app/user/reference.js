var express         = require("express"),
    User            = require("../../../models/users"),
    Reference       = require("../../../models/references"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

// **********************
// REFERENCE ROUTES
// These ROUTES follow the REST pattern
// **********************

// SHOW/Render Routes will NOT use the API convention 


// NEW
router.get('/u/:userId/ref/new', middleware.isAccountOwner, function(req, res){
    res.render('reference', { userId: req.params.userId });
});

// EDIT
router.get('/u/:userId/ref/:refId/edit', function(req, res){
    //lookup the ref
    Reference.findById(req.params.refId, function(err, foundRef){
       if(err){
            console.log(err); 
            res.redirect("/u/" + req.params.userId); 
       } else {
            //render the edit page and send the cl to it 
            res.render("reference-edit", { userId: req.params.userId, reference: foundRef }); 
       }
   });  
});

module.exports = router; 