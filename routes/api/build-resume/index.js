var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId';

// SHOW/Render Routes will NOT use the API convention 

// CREATE RESUME
router.post('/api/u/:userId/r', middleware.ensureAuthenticated, function(req, res){
  // REMEMBER TO SANITIZE THE BODY SINCE WE ALLOW THEM TO INPUT HTML 
  //sanitize for any input allowing HTML input (Test sanitizing the entire resume object first)
  //req.body.resume = req.sanitize(req.body.resume); 
  
  //find the user in the DB 
  User.findById(req.params.userId, function(err, foundUser){
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
            
            res.redirect('/u/' + req.params.userId + "/r/" + newResume._id + '/edit');
          }
      });
    }
  }); 
});

// UPDATE RESUME SUMMARY SECTION
router.put(rootUrl + '/summary', middleware.isAccountOwner, function(req, res){
  User.findById(req.params.userId, function(err, foundUser){
    if(err){
      console.log(err); 
    } else {
      Resume.findById(req.params.resumeId, function(err, foundResume){
        if(err){
          console.log(err);
        } else {
          
          foundResume.alias           = req.body.alias; 
          foundResume.introduction    = req.body.introduction; 
          foundResume.elevatorPitch   = req.body.elevatorPitch; 
          foundResume.objective       = req.body.objective;
          foundResume.careerSummary   = req.body.careerSummary;
          foundResume.backgroundImg   = req.body.backgroundImg;
          foundResume.fontColor       = req.body.fontColor;
          
          foundResume.save(); 
          res.status(200).json();
        }
        });
      }
  }); 
});

// GET THE DISPLAY ORDER
router.get(rootUrl + '/order', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        var sectionOrder = 
          [
            {
              sysTitle: 'timeline',
              title: foundResume.timeline.sectionTitle ? foundResume.timeline.sectionTitle : 'Timeline',
              order: foundResume.timeline.order ? foundResume.timeline.order : 1, 
              defaultOrder: 1
            },
            {
              sysTitle: 'skills',
              title: foundResume.skills.sectionTitle ? foundResume.skills.sectionTitle : 'Skills',
              order: foundResume.skills.order ? foundResume.skills.order : 2, 
              defaultOrder: 2
            },
            {
              sysTitle: 'interests',
              title: foundResume.interests.sectionTitle ? foundResume.interests.sectionTitle : 'Interests',
              order: foundResume.interests.order ? foundResume.interests.order : 3, 
              defaultOrder: 3
            },
            {
              sysTitle: 'experience',
              title: foundResume.experience.sectionTitle ? foundResume.experience.sectionTitle : 'Experience',
              order: foundResume.experience.order ? foundResume.experience.order : 4, 
              defaultOrder: 4
            },
            {
              sysTitle: 'education',
              title: foundResume.education.sectionTitle ? foundResume.education.sectionTitle : 'Education',
              order: foundResume.education.order ? foundResume.education.order : 5, 
              defaultOrder: 5
            },
            {
              sysTitle: 'projects',
              title: foundResume.projects.sectionTitle ? foundResume.projects.sectionTitle : 'Projects',
              order: foundResume.projects.order ? foundResume.projects.order : 6, 
              defaultOrder: 6
            },
            {
              sysTitle: 'quotes',
              title: foundResume.quotes.sectionTitle ? foundResume.quotes.sectionTitle : 'Quotes',
              order: foundResume.quotes.order ? foundResume.quotes.order : 7, 
              defaultOrder: 7
            },
            {
              sysTitle: 'other',
              title: foundResume.other.sectionTitle ? foundResume.other.sectionTitle : 'Other',
              order: foundResume.other.order ? foundResume.other.order : 8, 
              defaultOrder: 8
            }
          ];
          
          //TESTING //reset values 
          // for(var i=0; i < sectionOrder.length; i++){
          //   foundResume['' + sectionOrder[i].sysTitle + ''].order = sectionOrder[i].defaultOrder
          //   console.log(foundResume['' + sectionOrder[i].sysTitle + ''].order);
          //   console.log(sectionOrder[i].order)
          // }
          // foundResume.save(); 
          // console.log('Section Order Reset')
          
          //send back the object 
          res.status(200).json(sectionOrder);
        }
    }); 
});

// RESET ORDER TO DEFAULT ORDER
router.put(rootUrl + '/order/reset', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        var sectionOrder = 
          [
            {
              sysTitle: 'timeline',
              defaultOrder: 1
            },
            {
              sysTitle: 'skills',
              defaultOrder: 2
            },
            {
              sysTitle: 'interests',
              defaultOrder: 3
            },
            {
              sysTitle: 'experience',
              defaultOrder: 4
            },
            {
              sysTitle: 'education',
              defaultOrder: 5
            },
            {
              sysTitle: 'projects',
              defaultOrder: 6
            },
            {
              sysTitle: 'quotes',
              defaultOrder: 7
            },
            {
              sysTitle: 'other',
              defaultOrder: 8
            }
          ];
          
          //reset values 
          for(var i=0; i < sectionOrder.length; i++){
            foundResume['' + sectionOrder[i].sysTitle + ''].order = sectionOrder[i].defaultOrder
          }
          foundResume.save(); 
          
          //send back the object 
          res.status(200).json(sectionOrder);
        }
    }); 
});

// UPDATE THE SECTION ORDER
router.put(rootUrl + '/order/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
    if(err){
      console.log(err);
    } else {
      
      let num = (req.params.direction === 'down' ? 1 : -1);
      let moveTo = parseInt(req.body.order) + num;
      
      if(moveTo > 0 && moveTo <= 8){
      
        //check for the adjacent section
        if(foundResume.timeline.order === moveTo){
        foundResume.timeline.order = parseInt(req.body.order);
        } else 
            if (foundResume.skills.order === moveTo){
              foundResume.skills.order = parseInt(req.body.order);
            } else 
                if (foundResume.interests.order === moveTo){
                  foundResume.interests.order = parseInt(req.body.order);
                } else 
                    if (foundResume.experience.order === moveTo){
                      foundResume.experience.order = parseInt(req.body.order);
                    } else 
                        if (foundResume.education.order === moveTo){
                          foundResume.education.order = parseInt(req.body.order);
                        } else 
                            if (foundResume.projects.order === moveTo){
                              foundResume.projects.order = parseInt(req.body.order);
                            } else 
                                if (foundResume.quotes.order === moveTo){
                                  foundResume.quotes.order = parseInt(req.body.order);
                                } else 
                                    if (foundResume.other.order === moveTo){
                                      foundResume.other.order = parseInt(req.body.order);
                                    }
        
        // console.log(moveTo);
        foundResume['' + req.body.section + ''].order = moveTo;
        
        foundResume.save();
        
        // //send back the object 
        res.status(200).json(foundResume);
      } else {
        // //send back the object 
        res.status(204).json(); //204=Success, no content
      }
    }
  }); 
});

// DESTROY
router.delete(rootUrl, function(req, res){
  //find user
  User.findById(req.params.userId, function(err, foundUser){
    if (err){
      console.log(err); 
    } else {
      //find the resume in the DB and delete it 
      Resume.findByIdAndRemove(req.params.resumeId, function(err, foundResume){
        if(err){
          console.log(err);
        } else {
          // remove resume from users profile
          foundUser.resumes.splice(foundUser.resumes.indexOf(req.params.resumeId), 1); 
          foundUser.save(); 
          // res.redirect('/u/' + req.params.userId);
          res.status(200).json({ data: foundUser.resumes });
        }
      }); 
    }
  }); 
}); 

module.exports = router;