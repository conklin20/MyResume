var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();


const rootUrl = '/api/u/:userId/r/:resumeId/timeline';

//GET ALL TIMELINE EVENTS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        res.json(foundResume.timeline.details); 
      }
  });
});

// save section settings
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      foundResume.timeline.sectionTitle       = req.body.title; 
      foundResume.timeline.backgroundImg      = req.body.backgroundImg; 
      foundResume.timeline.headerFontColor    = req.body.headerFontColor;
      
      foundResume.save(); 
      res.status(200).json(foundResume.timeline);
    }
  });
});

// Add timeline event 
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      foundResume.timeline.details.push(req.body);
  
      foundResume.save(); 
      res.status(200).json(foundResume.timeline.details[foundResume.timeline.details.length-1]);
    }
  });
});


// remove timeline event
router.delete(rootUrl + '/:eventId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        
        const index = foundResume.timeline.details.findIndex(eventId => eventId.id === req.params.eventId);
        
        if(index !== -1){
          foundResume.timeline.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted event: ' + req.params.eventId});
        }
      }
    });
}); 


module.exports = router; 