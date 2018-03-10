var express         = require("express"),
    User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    middleware      = require("../../middleware/auth.js"),
    router          = express.Router();

// **********************
// RESUME ROUTES
// These ROUTES follow the REST pattern
// **********************

// Route    URL                             Verb    Purpose                   Mongoose Method
// -----------------------------------------------------------------------------
// INDEX    
// NEW      /:userID/resume/new             GET     Show new resume form      N/A
// CREATE   /:userID/resume                 POST    Create new resume in db   Resume.create()       
// SHOW     /:userID/resume/:resumeID       GET     Show resume form          Resume.findById()
// UPDATE   /:userID/resume/:resumeID       PUT     Update the resume in db   Resume.findByIdAndUpdate()
// EDIT     /:userID/resume/:resumeID/edit  GET     Show edit resume form     Resume.findById()
// DESTROY  /:userID/resume/:resumeID       DELETE  Delete resume from db     Resume.findByIdAndRemove()


// NEW
router.get('/:userID/resume/new', function(req, res){
  //find the user in the DB 
  User.findById(req.params.userID, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      res.render('resume', { user: foundUser, resume: null });
    }
  }); 
});

// CREATE
router.post('/:userID/resume', /*implement middleware*/ function(req, res){
  // REMEMBER TO SANITIZE THE BODY SINCE WERE ALLOW THEM TO INPUT HTML 
  //sanitize for any input allowing HTML input (Test sanitizing the entire resume object first)
  //req.body.resume = req.sanitize(req.body.resume); 
  
  //find the user in the DB 
  User.findById(req.params.userID, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      //Save the Resume to the DB
      Resume.create(req.body.resume, function(err, newResume) {
          if (err) {
              console.log(err); 
              // req.flash('error', err.message);
              return res.redirect('back');
          } else {
            
            //push the cover letter ref into the user array 
            foundUser.resumes.push(newResume._id);
            foundUser.save();
            
            res.redirect('/' + req.params.userID + "/resume/" + newResume._id + "/edit#stepTwo");
          }
      });
    }
  }); 
});

// EDIT
router.get('/:userID/resume/:resumeID/edit', function(req, res) {
  //find the user in the DB 
  User.findById(req.params.userID, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        res.render('resume', { user: foundUser, resume: foundResume });
      }
    }); 
    //   Resume.findById(req.params.resumeID).
    //   sort({date: 'asc'}), function(err, foundResume){
    //   if(err){
    //     console.log(err);
    //   } else {
    //     res.render('resume', { user: foundUser, resume: foundResume });
    //   }
    // }; 
    }
  }); 
});

// // EDIT (Page2) - This isnt ideal but I am not sure how else to handle it right now
// router.get('/:userID/resume/:resumeID/edit/page2', function(req, res) {
//   //find the user in the DB 
//   User.findById(req.params.userID, function(err, foundUser){
//     if(err){
//       console.log(err); 
//     } else {
//       Resume.findById(req.params.resumeID, function(err, foundResume){
//       if(err){
//         console.log(err);
//       } else {
//         res.render('resumeEditP2', { user: foundUser, resume: foundResume });
//       }
//     }); 
//     }
//   }); 
// });

// UPDATE
router.put('/:userID/resume/:resumeID/', function(req, res){
  //sanitize for any input allowing HTML input (Test sanitizing the entire resume object first)
  //req.body.resume = req.sanitize(req.body.resume); 
  
  //find the user in the DB 
  User.findById(req.params.userID, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
    //find the resume in the DB and Update it
    Resume.findByIdAndUpdate(req.params.resumeID, req.body.resume, function(err, foundResume){
        if(err){
          console.log(err);
        } else {
          //check if a timeline was entered
          if(req.body.timelineEvent){
              foundResume.timeline.push(req.body.timelineEvent);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepTwo");
              return; 
          } 
          //check if a skill category was entered 
          if(req.body.newSkillCategory){
              var newSkill = {
                  category: req.body.newSkillCategory,
                  skill: {
                    skillName: req.body.skill, 
                    proficiency: req.body.proficiency
                  }
                };
              foundResume.skills.push(newSkill);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepThree");
              return; 
          }
          //check if a skill was entered 
          if(req.body.category){
              var newSkill = {
                  skillName: req.body.skill, 
                  proficiency: req.body.proficiency
                };
              foundResume.skills[req.body.category].skill.push(newSkill);
          
              foundResume.save();
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepThree");
              return; 
          } 
          //check if a interest was entered 
          if(req.body.interest){
              foundResume.interests.push(req.body.interest);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepThree");
              return; 
          } 
          //check if a new prior work experience was entered 
          if(req.body.workExp){
              foundResume.experience.push(req.body.workExp);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFour");
              return; 
          }
          //check if a new responsibility has been added
          if(req.body.responsibility){
              foundResume.experience[req.body.responsibility.company].responsibilities.push(req.body.responsibility.responsibility);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFour");
              return; 
          }
          //check if a prior education has been added 
          if(req.body.education){
              var graduated = req.body.education.graduated === 'on' ? true : false; 
              req.body.education.graduated = graduated; 
              foundResume.education.push(req.body.education);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFive");
              return; 
          }
          //check if a prior education achievement has been added 
          if(req.body.achievement){
              foundResume.education[req.body.achievement.instituteName].achievements.push(req.body.achievement.achievement);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFive");
              return; 
          }
          //check if other content was entered 
          if(req.body.other){
              foundResume.other.push(req.body.other);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepSix");
              return; 
          }
          //check if other content bullet item was entered 
          if(req.body.bulletItems){
              foundResume.other[req.body.bulletItems.title].bulletItems.push(req.body.bulletItems.item);
          
              foundResume.save(); 
              res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepSix");
          } else {
            res.redirect('/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepOne");
              return; 
          }
        }
      }); 
    }
  }); 
}); 

// REMOVE TIMELINEEVENT ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/timelineEvent/:timelineID', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.timeline.splice(req.params.timelineID, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepTwo' );
      }
    }); 
}); 

// REMOVE SKILL CATEGORY ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/skillCategory/:catIdx', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        // eval(require("locus"))
        foundResume.skills.splice(req.params.catIdx, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepThree' );
      }
    }); 
}); 

// REMOVE SKILL ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/skillCategory/:catIdx/skill/:skillIdx', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.skills[req.params.catIdx].skill.splice(req.params.skillIdx, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepThree' );
      }
    }); 
}); 

// REMOVE INTEREST ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/interest/:interestIdx', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.interests.splice(req.params.interestIdx, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepThree' );
      }
    }); 
}); 

// REMOVE WORK EXP ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/workExp/:workExp', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.experience.splice(req.params.workExp, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFour' );
      }
    }); 
}); 

// REMOVE WORK EXP ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/workExp/:workExp/resp/:respID', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.experience[req.params.workExp].responsibilities.splice(req.params.respID, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFour' );
      }
    }); 
}); 

// REMOVE EDUCATION ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/education/:eduID', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.education.splice(req.params.eduID, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFive' );
      }
    }); 
});

// REMOVE EDUCATION ACHIVEMENT ELEMENT
router.put('/:userID/resume/:resumeID/education/:eduID/achv/:achvID', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.education[req.params.eduID].achievements.splice(req.params.achvID, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFive' );
      }
    }); 
}); 

// REMOVE 'OTHER' ARRAY ELEMENT
router.put('/:userID/resume/:resumeID/other/:sectionID', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.other.splice(req.params.sectionID, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepSix' );
      }
    }); 
});

// REMOVE 'OTHER' BULLET ITEM ELEMENT
router.put('/:userID/resume/:resumeID/other/:sectionID/item/:itemID', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.other[req.params.sectionID].bulletItems.splice(req.params.itemID, 1);
        foundResume.save(); 
        res.redirect('/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepSix' );
      }
    }); 
}); 

// DESTROY
router.delete('/:userID/resume/:resumeID', function(req, res){
  //find the resume in the DB and delete it 
  Resume.findByIdAndRemove(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        res.redirect('/' + req.params.userID);
      }
    }); 
}); 

// SHOW (PRINTABLE VERSION)
router.get('/:userID/resume/:resumeID/print', function(req, res){
  //find the user in the DB 
  User.findById(req.params.userID, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        res.render('resumePrint', { user: foundUser, resume: foundResume });
      }
    }); 
    }
  }); 
});

module.exports = router; 