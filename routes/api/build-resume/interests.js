var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId/interests';

//GET ALL TIMELINE EVENTS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        res.json(foundResume.interests.details); 
      }
  });
});

// save section settings
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      
      foundResume.interests.sectionTitle       = req.body.title; 
      foundResume.interests.backgroundImg      = req.body.backgroundImg; 
      foundResume.interests.fontColor          = req.body.fontColor; 
      foundResume.interests.headerFontColor    = req.body.headerFontColor;
      foundResume.interests.hideOnPrint        = req.body.hideOnPrint;
      
      foundResume.save(); 
      res.status(200).json(foundResume.interests);
    }
  });
});

// ADD NEW INTEREST
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        //zero reason I should be doing it this way but Im not getting this to work:  if(req.body.newInterest.newInterestCategory)
        // the string 'false' returns true, even when double negating it (!!'false'), which should force coercion
        var newCat = (req.body.newInterest.newInterestCategory === 'true' ? true : false); 
        
        if(newCat){
          // if a new category is being entered
          var newCatAndInterest = {
            category:     req.body.newInterest.category,
            categoryIcon: req.body.newInterest.categoryIcon,
            hideOnPrint:  req.body.newInterest.hideOnPrint,
            interest: {
              interest:   req.body.newInterest.interest
            }
        };
        
        foundResume.interests.details.push(newCatAndInterest);
        foundResume.save(); 
        //send back the newly created interest
        res.status(201).json(foundResume.interests.details[foundResume.interests.details.length - 1]); 
          
        } else {
          // if an existing category is being used
          var newInterest = {
            interest: req.body.newInterest.interest
          };
          let index = foundResume.interests.details.findIndex(interestCat => interestCat.category === req.body.newInterest.category);
          
          if(index !== -1){
            foundResume.interests.details[index].interest.push(newInterest);
            foundResume.save();
            //send back the newly created interest
            res.status(201).json(foundResume.interests.details[index]);
          }
        }
    }
  });
});

// REMOVE INTEREST CATEGORY ARRAY ELEMENT
router.delete(rootUrl + '/ic/:catId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.interests.details.findIndex(interestCat => interestCat.id === req.params.catId);
        
        if(index !== -1){
          foundResume.interests.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted interest category: ' + req.params.catId});
        }
      }
    });
}); 

// MOVE A INTEREST CATEGORY UP/DOWN
router.put(rootUrl + '/ic/:catId/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.interests.details.findIndex(interestCat => interestCat.id === req.params.catId);
        // console.log(index);
        if(index !== -1){
          //set index of the array item you want to swap catIdx with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(index), b = a + dir; 
          
          foundResume.interests.details = swapArrayElements(foundResume.interests.details, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.interests});
        }
      }
    }); 
}); 

// REMOVE INTEREST ARRAY ELEMENT
router.delete(rootUrl + '/ic/:catId/i/:interestIdx', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.interests.details.findIndex(interestCat => interestCat.id === req.params.catId);
        let interestIndex = req.params.interestIdx;
        
        if(index !== -1 && interestIndex !== -1){
          foundResume.interests.details[index].interest.splice(interestIndex, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted interest: ' + req.params.interestIdx});
        }
      }
    }); 
}); 

// MOVE A INTEREST UP/DOWN
router.put(rootUrl + '/ic/:catId/i/:interestIdx/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.interests.details.findIndex(interestCat => interestCat.id === req.params.catId);
        let interestIndex = req.params.interestIdx;
        
        if(index !== -1 && interestIndex !== -1){
          //set index of the array item you want to swap interestIndex with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(interestIndex), b = a + dir;
          
          foundResume.interests.details[index].interest = swapArrayElements(foundResume.interests.details[index].interest, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.interests});
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