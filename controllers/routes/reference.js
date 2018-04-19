var express         = require("express"),
    User            = require("../../models/users"),
    Reference       = require("../../models/references"),
    middleware      = require("../../middleware/auth.js"),
    router          = express.Router();

// **********************
// RESUME ROUTES
// These ROUTES follow the REST pattern
// **********************

// Route    URL                             Verb    Purpose                   Mongoose Method
// -----------------------------------------------------------------------------
// INDEX    /:userID                        GET     Shows all Ref's for user  N/A
// NEW      /:userID/reference/new          GET     Show new Ref page         
// CREATE   /:userID/reference              POST    Save Ref to db            Reference.create()  
// SHOW     
// UPDATE   /:userID/reference/:refID       PUT     Update the ref in db      Reference.findByIdAndUpdate()
// EDIT     /:userID/reference/:refID/edit  GET     Show ref edit form        Reference.findById()
// DESTROY  /:userID/reference/:refID       DELETE  delete the ref            Reference.findByIdAndRemove()


// NEW
router.get('/user/:userID/reference/new', middleware.isAccountOwner, function(req, res){
    res.render('reference', { userID: req.params.userID });
    //res.render('coverletter', { userID: req.params.userID }); 
//   //find the user in the DB 
//   User.findById(req.params.userID, function(err, user){
//     if(err){
//       console.log(err); 
//     } else {
//       res.render('resume', { user: user });
//     }
//   }); 
});

// CREATE
router.post('/user/:userID/reference', middleware.isAccountOwner, function(req, res){
    //lookup the user 
    User.findById(req.params.userID, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("/user/" + req.params.userID); 
        } else {
            //Save the Reference to the DB
            Reference.create(req.body.reference, function(err, reference) {
                if (err) {
                    console.log(err); 
                    req.flash('error', err.message);
                    res.redirect("/user/" + req.params.userID); 
                } else {
                    //save ref
                    reference.save(); 
                    
                    //push the ref into the user array 
                    foundUser.references.push(reference._id);
                    foundUser.save();
                    
                    req.flash('success', '');
                    res.redirect('/user/' + req.params.userID);
                }
            });
        }
    });
});

// EDIT
router.get('/user/:userID/reference/:refID/edit', function(req, res){
    //lookup the ref
    Reference.findById(req.params.refID, function(err, foundRef){
       if(err){
            console.log(err); 
            res.redirect("/user/" + req.params.userID); 
       } else {
            //render the edit page and send the cl to it 
            res.render("referenceEdit", { userID: req.params.userID, reference: foundRef }); 
       }
   });  
});

// UPDATE
router.put('/user/:userID/reference/:refID', function(req, res){
   //lookup and update the ref
   Reference.findByIdAndUpdate(req.params.refID, req.body.reference, function(err, updatedRef){
        if(err){
            console.log(err); 
            res.redirect("/user/" + req.params.userID); 
        } 
        res.redirect('/user/' + req.params.userID);
   });  
});

// DESTROY 
router.delete('/user/:userID/reference/:refID', middleware.isAccountOwner, function(req, res){
    //find user
    User.findById(req.params.userID, function(err, foundUser){
        if (err){
            console.log(err); 
            res.redirect("/user/" + req.params.userID); 
        } else {
            //delete the Cover Letter
            Reference.findByIdAndRemove(req.params.refID, function(err){
            if(err){
                console.log(err); 
                res.redirect('/user/' + req.params.userID); 
            } else {
                //remove the ref reference from the user document 
                foundUser.references.splice(foundUser.references.indexOf(req.params.refID), 1);
                foundUser.save();
                res.redirect('/user/' + req.params.userID); 
            } 
          });
        }
    }); 
});

module.exports = router; 