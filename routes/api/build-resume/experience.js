var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId/experience';

// SAVE SECTION SETTINGS
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      
      foundResume.experience.sectionTitle       = req.body.title; 
      foundResume.experience.backgroundImg      = req.body.backgroundImg; 
      foundResume.experience.fontColor          = req.body.fontColor; 
      foundResume.experience.headerFontColor    = req.body.headerFontColor;
      foundResume.experience.hideOnPrint        = req.body.hideOnPrint;
      
      foundResume.save();
      res.status(200).json(foundResume.experience);
    }
  });
});

//GET ALL TIMELINE EVENTS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        res.status(200).json(foundResume.experience.details);
      }
  });
});

// ADD NEW EXPERINCE (COMPANY) 
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        
        foundResume.experience.details.push(req.body.newCompany);
    
        foundResume.save(); 
        res.status(200).json(foundResume.experience.details[foundResume.experience.details.length-1]);
      }
  });
});

// ADD NEW RESPONSIBILITY TO WORK EXPERIENCE
router.put(rootUrl + '/r', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        let index = foundResume.experience.details.findIndex(company => company.companyName === req.body.newResponsibility.company);

        if(index !== -1){
          foundResume.experience.details[index].responsibilities.push(req.body.newResponsibility.responsibility);
      
          foundResume.save(); 
          res.status(200).json(foundResume.experience.details[index]);
        }
      }
  });
})

// REMOVE EXPERIENCE (ENTIRE DETAIL ARRAY ELEMENT)
router.delete(rootUrl + '/c/:companyId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.experience.details.findIndex(company => company.id === req.params.companyId);
        
        if(index !== -1){
          foundResume.experience.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted work experience: ' + req.params.companyId});
        }
      }
    });
}); 

// REMOVE RESPONSIBILITY
router.delete(rootUrl + '/c/:companyId/r/:respIdx', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.experience.details.findIndex(company => company.id === req.params.companyId);
        let respIndex = req.params.respIdx; //foundResume.experience.details[index].responsibilities[req.params.respIdx];
        
        if(index !== -1 && respIndex !== -1){
          foundResume.experience.details[index].responsibilities.splice(respIndex, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted skill: ' + req.params.skillId});
        }
      }
    }); 
}); 

// MOVE A RESPONSIBILITY UP/DOWN
router.put(rootUrl + '/c/:companyId/r/:respIdx' + '/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.experience.details.findIndex(company => company.id === req.params.companyId);
        let respIndex = req.params.respIdx; // foundResume.experience.details[index].responsibilities[req.params.respIdx];

        if(index !== -1 && respIndex !== -1){
          //set index of the array item you want to swap skillIndex with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(respIndex), b = a + dir;
          
          foundResume.experience.details[index].responsibilities = swapArrayElements(foundResume.experience.details[index].responsibilities, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.experience});
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