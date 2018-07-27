var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId/skills';

// save section settings
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
    if(err){
      console.log(err);
    } else {
      
      foundResume.skills.sectionTitle       = req.body.title; 
      foundResume.skills.backgroundImg      = req.body.backgroundImg; 
      foundResume.skills.fontColor          = req.body.fontColor; 
      foundResume.skills.headerFontColor    = req.body.headerFontColor;
      foundResume.skills.hideOnPrint        = req.body.hideOnPrint;

      foundResume.save(); 
      res.status(200).json(foundResume.skills);
    }
  });
});

//GET ALL SKILLS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        res.json(foundResume.skills.details); 
      }
  });
});

// ADD NEW SKILL
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        
        //zero reason I should be doing it this way but Im not getting this to work:  if(req.body.newSkill.newSkillCategory)
        // the string 'false' returns true, even when double negating it (!!'false'), which should force coercion
        var newCat = (req.body.newSkill.newSkillCategory === 'true' ? true : false); 
        
        if(newCat){
          // if a new category is being entered
          var newCatAndSkill = {
            category:     req.body.newSkill.category,
            categoryIcon: req.body.newSkill.categoryIcon,
            hideOnPrint:  req.body.newSkill.hideOnPrint,
            skill: {
              skillName:    req.body.newSkill.skill, 
              proficiency:  req.body.newSkill.proficiency
          }
        };
        
        foundResume.skills.details.push(newCatAndSkill);
        foundResume.save(); 
        //send back the newly created skill
        res.status(201).json(foundResume.skills.details[foundResume.skills.details.length - 1]); 
          
        } else {
          // if an existing category is being used
          var newSkill = {
            skillName: req.body.newSkill.skill, 
            proficiency: req.body.newSkill.proficiency
          };
          let index = foundResume.skills.details.findIndex(skillCat => skillCat.category === req.body.newSkill.category);
          
          if(index !== -1){
            foundResume.skills.details[index].skill.push(newSkill);
            foundResume.save();
            //send back the newly created skill
            res.status(201).json(foundResume.skills.details[index]);
          }
        }
      }
  });
});

// REMOVE SKILL CATEGORY ARRAY ELEMENT
router.delete(rootUrl + '/sc/:catId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.skills.details.findIndex(skillCat => skillCat.id === req.params.catId);
        
        if(index !== -1){
          foundResume.skills.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted skill category: ' + req.params.catId});
        }
      }
    });
}); 

// MOVE A SKILL CATEGORY UP/DOWN
router.put(rootUrl + '/sc/:catId/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.skills.details.findIndex(skillCat => skillCat.id === req.params.catId);
        // console.log(index);
        if(index !== -1){
          //set index of the array item you want to swap catIdx with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(index), b = a + dir; 
          
          foundResume.skills.details = swapArrayElements(foundResume.skills.details, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.skills});
        }
      }
    }); 
}); 

// REMOVE SKILL ARRAY ELEMENT
router.delete(rootUrl + '/sc/:catId/s/:skillId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.skills.details.findIndex(skillCat => skillCat.id === req.params.catId);
        let skillIndex = foundResume.skills.details[index].skill.findIndex(skill => skill.id === req.params.skillId);
        
        if(index !== -1 && skillIndex !== -1){
          foundResume.skills.details[index].skill.splice(skillIndex, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted skill: ' + req.params.skillId});
        }
      }
    }); 
}); 

// MOVE A SKILL UP/DOWN
router.put(rootUrl + '/sc/:catId/s/:skillId/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.skills.details.findIndex(skillCat => skillCat.id === req.params.catId);
        let skillIndex = foundResume.skills.details[index].skill.findIndex(skill => skill.id === req.params.skillId);
        
        if(index !== -1 && skillIndex !== -1){
          //set index of the array item you want to swap skillIndex with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(skillIndex), b = a + dir;
          
          foundResume.skills.details[index].skill = swapArrayElements(foundResume.skills.details[index].skill, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.skills});
        }
      }
    }); 
}); 

function findResumeById(resumeId){
  //find the resume in the DB
  Resume.findById(resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        return foundResume; 
      }
    }); 
}

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