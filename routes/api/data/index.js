var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    CoverLetter     = require("../../../models/coverletters"),
    router          = express.Router();
    

const rootUrl = '/api/data';

// GET ALL USERS 
router.get(rootUrl+'/users', function(req, res) {
  //find the user in the DB 
  User.find(function(err, allUsers){
    if(err){
      console.log(err); 
    } else {
      //send back the object 
      res.status(200).json(allUsers);
    }
  }); 
});

// GET ALL RESUMES 
router.get(rootUrl+'/resumes', function(req, res) {
  //find the user in the DB 
  Resume.find(function(err, allResumes){
    if(err){
      console.log(err); 
    } else {
      //send back the object 
      res.status(200).json(allResumes);
    }
  }); 
});


// GET SPECIFIC RESUME
router.get(rootUrl+'/r/:resumeId', function(req, res) {
  Resume.findById(req.params.resumeId, function(err, foundResume){
    if(err){
      console.log(err);
    } else {
      //send back the object 
      res.status(200).json(foundResume);
    }
  });
});

module.exports = router; 

