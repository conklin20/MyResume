var express         = require("express"),
    User            = require("../../models/users"),
    Reference       = require("../../models/references"),
    middleware      = require("../../middleware/auth.js"),
    router          = express.Router();

// **********************
// REFERENCE ROUTES
// These ROUTES follow the REST pattern
// **********************

// SHOW/Render Routes will NOT use the API convention 

const rootUrl = '/api/u/:userId/ref';

// CREATE
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
    //lookup the user 
    User.findById(req.params.userId, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/u/" + req.params.userId); 
        } else {
            //Save the Reference to the DB
            Reference.create(req.body.reference, function(err, reference) {
                if (err) {
                    console.log(err); 
                    req.flash('error', err.message);
                    res.redirect("/u/" + req.params.userId); 
                } else {
                    //save ref
                    reference.save(); 
                    
                    //push the ref into the user array 
                    foundUser.references.push(reference._id);
                    foundUser.save();
                    
                    req.flash('success', '');
                    res.redirect('/u/' + req.params.userId);
                }
            });
        }
    });
});

// UPDATE
router.put(rootUrl + '/:refId', function(req, res){
   //lookup and update the ref
   Reference.findByIdAndUpdate(req.params.refId, req.body.reference, function(err, updatedRef){
        if(err){
            console.log(err); 
            res.redirect("/u/" + req.params.userId); 
        } 
        res.redirect('/u/' + req.params.userId);
   });  
});

// DESTROY 
router.delete(rootUrl + '/:refId', middleware.isAccountOwner, function(req, res){
    //find user
    User.findById(req.params.userId, function(err, foundUser){
        if (err){
            console.log(err); 
            res.redirect("/u/" + req.params.userId); 
        } else {
            //delete the Reference
            Reference.findByIdAndRemove(req.params.refId, function(err){
            if(err){
                console.log(err); 
                res.redirect('/u/' + req.params.userId); 
            } else {
                //remove the ref reference from the user document 
                foundUser.references.splice(foundUser.references.indexOf(req.params.refId), 1);
                foundUser.save();
                // res.redirect('/u/' + req.params.userId); 
                res.status(200).json({ data: foundUser.references });
            } 
          });
        }
    }); 
});

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