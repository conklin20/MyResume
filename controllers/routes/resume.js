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
router.get('/user/:userID/resume/new', middleware.ensureAuthenticated, function(req, res){
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
router.post('/user/:userID/resume', middleware.ensureAuthenticated, function(req, res){
  // REMEMBER TO SANITIZE THE BODY SINCE WE ALLOW THEM TO INPUT HTML 
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
            
            res.redirect('/user/' + req.params.userID + "/resume/" + newResume._id + "/edit#stepTwo");
          }
      });
    }
  }); 
});

// EDIT
router.get('/user/:userID/resume/:resumeID/edit', middleware.isAccountOwner, function(req, res) {
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

// UPDATE
router.put('/user/:userID/resume/:resumeID/', middleware.isAccountOwner, function(req, res){
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
          // TIMELINE UPDATES
          //check if a timeline background and font was entered 
          if(req.body.timeline){
              foundResume.timeline.order          = 1; 
              foundResume.timeline.backgroundImg  = req.body.timeline.backgroundImg; 
              foundResume.timeline.fontColor      = req.body.timeline.fontColor; 
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepTwo");
              return; 
          } 
          //check if a timeline was entered
          if(req.body.timelineEvent){
              foundResume.timeline.details.push(req.body.timelineEvent);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepTwo");
              return; 
          } 
          // SKILL UPDATES
          //check if a skill background and font was entered 
          if(req.body.skills){
              foundResume.skills.order          = 2; 
              foundResume.skills.backgroundImg  = req.body.skills.backgroundImg; 
              foundResume.skills.fontColor      = req.body.skills.fontColor; 
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepThree");
              return; 
          }
          //check if a skill was entered 
          if(req.body.skill){
              if(req.body.newSkillCategory){
                // if a new category is being entered
                var newSkillCat = {
                    category: req.body.newSkillCategory,
                    categoryIcon: req.body.newSkillCategoryIcon,
                    skill: {
                      skillName: req.body.skill, 
                      proficiency: req.body.proficiency
                    }
                  };
                foundResume.skills.details.push(newSkillCat);
            
                foundResume.save(); 
                res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepThree");
                return; 
              } else {
                // if an existing category is being used
                var newSkill = {
                    skillName: req.body.skill, 
                    proficiency: req.body.proficiency
                  };
                  
                foundResume.skills.details[req.body.category].skill.push(newSkill);
            
                foundResume.save();
                res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepThree");
                return; 
              }
          }
          // INTEREST UPDATES
          //check if a interest background and font was entered 
          if(req.body.interests){
              foundResume.interests.order          = 3; 
              foundResume.interests.backgroundImg  = req.body.interests.backgroundImg; 
              foundResume.interests.fontColor      = req.body.interests.fontColor; 
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFour");
              return; 
          }
          
          //check if a interest was entered 
          if(req.body.interest){
              if(req.body.newInterestCategory){
                // if a new category is being entered
                var newInterestCat = {
                    category: req.body.newInterestCategory,
                    categoryIcon: req.body.newInterestCategoryIcon,
                    interest: {
                      interest: req.body.interest, 
                    }
                  };
                foundResume.interests.details.push(newInterestCat);
            
                foundResume.save(); 
                res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFour");
                return; 
              } else {
                // if an existing category is being used
                var newInterest = {
                    interest: req.body.interest
                  };
                  
                foundResume.interests.details[req.body.category].interest.push(newInterest);
            
                foundResume.save();
                res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFour");
                return; 
              }
          }
          // WORK EXP UPDATES
          //check if a experience background and font was entered 
          if(req.body.experience){
              foundResume.experience.order          = 4; 
              foundResume.experience.backgroundImg  = req.body.experience.backgroundImg; 
              foundResume.experience.fontColor      = req.body.experience.fontColor; 
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFive");
              return; 
          } 
          //check if a new prior work experience was entered 
          if(req.body.workExp){
              foundResume.experience.details.push(req.body.workExp);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFive");
              return; 
          }
          //check if a new responsibility has been added
          if(req.body.responsibility){
              foundResume.experience.details[req.body.responsibility.company].responsibilities.push(req.body.responsibility.responsibility);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepFive");
              return; 
          }
          // EDUCATION UPDATES
          //check if a education background and font was entered 
          if(req.body.education){
              foundResume.education.order          = 5; 
              foundResume.education.backgroundImg  = req.body.education.backgroundImg; 
              foundResume.education.fontColor      = req.body.education.fontColor; 
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepSix");
              return; 
          } 
          //check if a prior education has been added 
          if(req.body.edu){
              var graduated = req.body.edu.graduated === 'on' ? true : false; 
              req.body.edu.graduated = graduated; 
              foundResume.education.details.push(req.body.edu);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepSix");
              return; 
          }
          //check if a prior education achievement has been added 
          if(req.body.achievement){
              foundResume.education.details[req.body.achievement.instituteName].achievements.push(req.body.achievement.achievement);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepSix");
              return; 
          }
          // QUOTES UPDATES
          if(req.body.quotes){
              foundResume.quotes.order          = 6; 
              foundResume.quotes.backgroundImg  = req.body.quotes.backgroundImg; 
              foundResume.quotes.fontColor      = req.body.quotes.fontColor; 
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepSeven");
              return; 
          }
          if(req.body.quote){
              foundResume.quotes.details.push(req.body.quote);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepSeven");
              return; 
          }
          // OTHER SECTION UPDATES
          //check if other content was entered 
          if(req.body.otherSection){
              foundResume.other.order          = 7; 
              foundResume.other.backgroundImg  = req.body.otherSection.backgroundImg; 
              foundResume.other.fontColor      = req.body.otherSection.fontColor; 
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepEight");
              return; 
          }
          if(req.body.other){
              foundResume.other.details.push(req.body.other);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepEight");
              return; 
          }
          //check if other content bullet item was entered 
          if(req.body.bulletItems){
              foundResume.other.details[req.body.bulletItems.title].bulletItems.push(req.body.bulletItems.item);
          
              foundResume.save(); 
              res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepEight");
          } else {
            res.redirect('/user/' + req.params.userID + "/resume/" + req.params.resumeID + "/edit#stepOne");
              return; 
          }
        }
      }); 
    }
  }); 
}); 

// REMOVE TIMELINEEVENT ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/timelineEvent/:timelineID', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.timeline.details.splice(req.params.timelineID, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepTwo' );
      }
    }); 
}); 

// REMOVE SKILL CATEGORY ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/skillCategory/:catIdx', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        // eval(require("locus"))
        foundResume.skills.details.splice(req.params.catIdx, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepThree' );
      }
    }); 
}); 

// REMOVE SKILL ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/skillCategory/:catIdx/skill/:skillIdx', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.skills.details[req.params.catIdx].skill.splice(req.params.skillIdx, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepThree' );
      }
    }); 
}); 

// REMOVE INTEREST CATEGORY ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/interestCategory/:catIdx', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        // eval(require("locus"))
        foundResume.interests.details.splice(req.params.catIdx, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFour' );
      }
    }); 
}); 

// REMOVE INTEREST ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/interestCategory/:catIdx/interest/:interestIdx', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.interests.details[req.params.catIdx].interest.splice(req.params.interestIdx, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFour' );
      }
    }); 
}); 

// REMOVE WORK EXP ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/workExp/:workExp', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.experience.details.splice(req.params.workExp, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFive' );
      }
    }); 
}); 

// REMOVE WORK EXP ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/workExp/:workExp/resp/:respID', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.experience.details[req.params.workExp].responsibilities.splice(req.params.respID, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepFive' );
      }
    }); 
}); 

// REMOVE EDUCATION ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/education/:eduID', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.education.details.splice(req.params.eduID, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepSix' );
      }
    }); 
});

// REMOVE EDUCATION ACHIVEMENT ELEMENT
router.put('/user/:userID/resume/:resumeID/education/:eduID/achv/:achvID', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.education.details[req.params.eduID].achievements.splice(req.params.achvID, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepSix' );
      }
    }); 
}); 

// REMOVE QUOTE
router.put('/user/:userID/resume/:resumeID/quote/:quoteID', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.quotes.details.splice(req.params.quoteID, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepSeven' );
      }
    }); 
});

// REMOVE 'OTHER' ARRAY ELEMENT
router.put('/user/:userID/resume/:resumeID/other/:sectionID', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.other.details.splice(req.params.sectionID, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepEight' );
      }
    }); 
});

// REMOVE 'OTHER' BULLET ITEM ELEMENT
router.put('/user/:userID/resume/:resumeID/other/:sectionID/item/:itemID', middleware.isAccountOwner, function(req, res){
  //find the resume in the DB and delete it 
  Resume.findById(req.params.resumeID, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        foundResume.other.details[req.params.sectionID].bulletItems.splice(req.params.itemID, 1);
        foundResume.save(); 
        res.redirect('/user/' + req.params.userID + '/resume/' + req.params.resumeID + '/edit#stepSeven' );
      }
    }); 
}); 

// DESTROY
router.delete('/user/:userID/resume/:resumeID', function(req, res){
  //find user
  User.findById(req.params.userID, function(err, foundUser){
    if (err){
      console.log(err); 
    } else {
      //find the resume in the DB and delete it 
      Resume.findByIdAndRemove(req.params.resumeID, function(err, foundResume){
        if(err){
          console.log(err);
        } else {
          // remove resume from users profile
          foundUser.resumes.splice(foundUser.resumes.indexOf(req.params.resumeID), 1); 
          foundUser.save(); 
          res.redirect('/user/' + req.params.userID);
        }
      }); 
    }
  }); 
}); 

// SHOW (PRINTABLE VERSION)
router.get('/user/:userID/resume/:resumeID/print', function(req, res){
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