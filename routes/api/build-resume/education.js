var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId/education';

//GET ALL TIMELINE EVENTS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        res.json(foundResume.education.details); 
      }
  });
});

// save section settings
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      
      foundResume.education.sectionTitle       = req.body.title; 
      foundResume.education.backgroundImg      = req.body.backgroundImg; 
      foundResume.education.fontColor          = req.body.fontColor; 
      foundResume.education.headerFontColor    = req.body.headerFontColor;
      foundResume.education.hideOnPrint        = req.body.hideOnPrint;
      
      foundResume.save(); 
      res.status(200).json(foundResume.education);
    }
  });
});

// ADD NEW EDUCATION RECORD (SCHOOL/INSTITUTE) 
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        
        foundResume.education.details.push(req.body.newSchool);
    
        foundResume.save(); 
        res.status(200).json(foundResume.education.details[foundResume.education.details.length-1]);
      }
  });
});

// ADD NEW ACHIEVEMENT TO EDU
router.put(rootUrl + '/a', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        let index = foundResume.education.details.findIndex(school => school.instituteName === req.body.newAchievement.school);

        if(index !== -1){
          foundResume.education.details[index].achievements.push(req.body.newAchievement.achievement);
      
          foundResume.save(); 
          res.status(200).json(foundResume.education.details[index]);
        }
      }
  });
})

// REMOVE EDUCATION (ENTIRE DETAIL ARRAY ELEMENT)
router.delete(rootUrl + '/s/:schoolId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.education.details.findIndex(school => school.id === req.params.schoolId);
        
        if(index !== -1){
          foundResume.education.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted work education: ' + req.params.companyId});
        }
      }
    });
}); 

// REMOVE ACHIEVEMENT
router.delete(rootUrl + '/s/:schoolId/a/:achivIdx', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.education.details.findIndex(school => school.id === req.params.schoolId);
        let achivIndex = req.params.achivIdx; 
        
        if(index !== -1 && achivIndex !== -1){
          foundResume.education.details[index].achievements.splice(achivIndex, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted achievement: ' + req.params.achivIdx});
        }
      }
    }); 
}); 

// MOVE A ACHIEVEMENT UP/DOWN
router.put(rootUrl + '/s/:schoolId/a/:achivIdx' + '/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.education.details.findIndex(school => school.id === req.params.schoolId);
        let achivIndex = req.params.achivIdx; 

        if(index !== -1 && achivIndex !== -1){
          //set index of the array item you want to swap skillIndex with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(achivIndex), b = a + dir;
          
          foundResume.education.details[index].achievements = swapArrayElements(foundResume.education.details[index].achievements, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.education});
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