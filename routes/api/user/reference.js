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

// GET ALL USER REFERENCES
router.get(rootUrl, middleware.isAccountOwner, function(req, res) {
  //find the user in the DB   
  User.findById(req.params.userId).
    populate("references").
    exec(function(err, data){
      if(err){
        console.log(err); 
      } else {
        res.status(200).json({ data: data.references });
      }
    }); 
});

module.exports = router; 