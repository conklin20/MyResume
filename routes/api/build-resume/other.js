var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId/other';

//GET ALL TIMELINE EVENTS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        res.json(foundResume.other.details); 
      }
  });
});

// save section settings
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      
      // foundResume.other.sectionTitle       = req.body.title; 
      foundResume.other.backgroundImg      = req.body.backgroundImg; 
      foundResume.other.fontColor          = req.body.fontColor; 
      foundResume.other.headerFontColor    = req.body.headerFontColor;
      foundResume.other.hideOnPrint        = req.body.hideOnPrint;
      
      foundResume.save(); 
      res.status(200).json(foundResume.other);
    }
  });
});

// CREATE NEW SECTION
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        
        foundResume.other.details.push(req.body.newSection);
    
        foundResume.save(); 
        res.status(200).json(foundResume.other.details[foundResume.other.details.length-1]);
      }
  });
});

// // CREATE NEW SECTION BULLET ITEM
router.put(rootUrl + '/b', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        let index = foundResume.other.details.findIndex(section => section.id === req.body.newBullet.id);

        if(index !== -1){
          foundResume.other.details[index].bulletItems.push(req.body.newBullet.bulletItem);
      
          foundResume.save(); 
          res.status(200).json(foundResume.other.details[index]);
        }
      }
  });
});

// REMOVE SECTION
router.delete(rootUrl + '/s/:sectionId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.other.details.findIndex(section => section.id === req.params.sectionId);
        
        if(index !== -1){
          foundResume.other.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted section: ' + req.params.sectionId});
        }
      }
    });
}); 

// REMOVE SECTION BULLET ITEM
router.delete(rootUrl + '/s/:sectionId/b/:bulletIdx', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.other.details.findIndex(section => section.id === req.params.sectionId);
        let bulletIndex = req.params.bulletIdx; 

        if(index !== -1 && bulletIndex !== -1){
          foundResume.other.details[index].bulletItems.splice(bulletIndex, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted bullet item: ' + req.params.bulletIdx});
        }
      }
    }); 
});

// MOVE A SECTION UP/DOWN
router.put(rootUrl + '/s/:sectionId/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.other.details.findIndex(section => section.id === req.params.sectionId);
        // console.log(index);
        if(index !== -1){
          //set index of the array item you want to swap catIdx with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(index), b = a + dir; 
          
          foundResume.other.details = swapArrayElements(foundResume.other.details, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.other});
        }
      }
    }); 
}); 

// MOVE SECTION BULLET ITEM UP/DOWN
router.put(rootUrl + '/s/:sectionId/b/:bulletIdx/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.other.details.findIndex(section => section.id === req.params.sectionId);
        let bulletIndex = req.params.bulletIdx; 

        if(index !== -1 && bulletIndex !== -1){
          //set index of the array item you want to swap skillIndex with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(bulletIndex), b = a + dir;
          
          foundResume.other.details[index].bulletItems = swapArrayElements(foundResume.other.details[index].bulletItems, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.other});
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