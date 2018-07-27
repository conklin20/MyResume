var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId/projects';

//GET ALL TIMELINE EVENTS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        res.json(foundResume.projects.details); 
      }
  });
});

// save section settings
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      
      foundResume.projects.sectionTitle       = req.body.title; 
      foundResume.projects.backgroundImg      = req.body.backgroundImg; 
      foundResume.projects.fontColor          = req.body.fontColor; 
      foundResume.projects.headerFontColor    = req.body.headerFontColor;
      foundResume.projects.hideOnPrint        = req.body.hideOnPrint;
      
      foundResume.save(); 
      res.status(200).json(foundResume.projects);
    }
  });
});

// CREATE NEW PROJECT 
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        
        foundResume.projects.details.push(req.body.newProject);
    
        foundResume.save(); 
        res.status(200).json(foundResume.projects.details[foundResume.projects.details.length-1]);
      }
  });
});

// CREATE NEW PROJECT BULLET ITEM
router.put(rootUrl + '/b', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        let index = foundResume.projects.details.findIndex(project => project.id === req.body.newBullet.id);
        
        if(index !== -1){
          foundResume.projects.details[index].projectDetail.push(req.body.newBullet.projectDetail);
      
          foundResume.save(); 
          res.status(200).json(foundResume.projects.details[index]);
        }
      }
  });
});

// REMOVE PROJECT
router.delete(rootUrl + '/p/:projectId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.projects.details.findIndex(project => project.id === req.params.projectId);
        
        if(index !== -1){
          foundResume.projects.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted project: ' + req.params.projectId});
        }
      }
    });
}); 

// REMOVE PROJECT BULLET ITEM
router.delete(rootUrl + '/p/:projectId/b/:bulletIdx', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.projects.details.findIndex(project => project.id === req.params.projectId);
        let bulletIndex = req.params.bulletIdx; 
        
        if(index !== -1 && bulletIndex !== -1){
          foundResume.projects.details[index].projectDetail.splice(bulletIndex, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted bullet item: ' + req.params.bulletIdx});
        }
      }
    }); 
}); 

// MOVE PROJECT BULLET ITEM UP/DOWN
router.put(rootUrl + '/p/:projectId/b/:bulletIdx/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.projects.details.findIndex(project => project.id === req.params.projectId);
        let bulletIndex = req.params.bulletIdx; 

        if(index !== -1 && bulletIndex !== -1){
          //set index of the array item you want to swap skillIndex with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(bulletIndex), b = a + dir;
          
          foundResume.projects.details[index].projectDetail = swapArrayElements(foundResume.projects.details[index].projectDetail, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.projects});
        }
      }
    }); 
}); 

// arrow functioin to swap array element positions
const swapArrayElements = (arr, x, y) => {
  if (arr[x] === undefined || arr[y] === undefined) {
    return arr
  }
  const a = x > y ? y : x
  const b = x > y ? x : y
  return [
    ...arr.slice(0, a),
    arr[b],
    ...arr.slice(a+1, b),
    arr[a],
    ...arr.slice(b+1)
  ]
}

module.exports = router; 