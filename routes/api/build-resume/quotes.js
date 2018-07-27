var express         = require("express"),
    User            = require("../../../models/users"),
    Resume          = require("../../../models/resumes"),
    middleware      = require("../../../middleware/auth.js"),
    router          = express.Router();

const rootUrl = '/api/u/:userId/r/:resumeId/quotes';

//GET ALL TIMELINE EVENTS FOR GIVEN RESUME
router.get(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        res.json(foundResume.quotes.details); 
      }
  });
});

// save section settings
router.put(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
    if(err){
      console.log(err);
    } else {
      
      foundResume.quotes.sectionTitle       = req.body.title; 
      foundResume.quotes.backgroundImg      = req.body.backgroundImg; 
      foundResume.quotes.fontColor          = req.body.fontColor; 
      foundResume.quotes.headerFontColor    = req.body.headerFontColor;
      foundResume.quotes.hideOnPrint        = req.body.hideOnPrint;
      
      foundResume.save(); 
      res.status(200).json(foundResume.quotes);
    }
  });
});

// ADD NEW QUOTE 
router.post(rootUrl, middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume) {
      if(err){
        console.log(err);
      } else {
        
        foundResume.quotes.details.push(req.body.newQuote);
    
        foundResume.save(); 
        res.status(200).json(foundResume.quotes.details[foundResume.quotes.details.length-1]);
      }
  });
});

// REMOVE QUOTE
router.delete(rootUrl + '/q/:quoteId', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.quotes.details.findIndex(quote => quote.id === req.params.quoteId);
        
        if(index !== -1){
          foundResume.quotes.details.splice(index, 1);
          foundResume.save(); 
          res.status(200).json({message: 'You deleted work quote: ' + req.params.quoteId});
        }
      }
    });
}); 

// MOVE A QUOTE UP/DOWN
router.put(rootUrl + '/q/:quoteId/:direction', middleware.isAccountOwner, function(req, res){
  Resume.findById(req.params.resumeId, function(err, foundResume){
      if(err){
        console.log(err);
      } else {
        let index = foundResume.quotes.details.findIndex(quote => quote.id === req.params.quoteId);
        // console.log(index);
        if(index !== -1){
          //set index of the array item you want to swap catIdx with
          let dir = (req.params.direction === 'down' ? 1 : -1); 
          let a = Number(index), b = a + dir; 
          
          foundResume.quotes.details = swapArrayElements(foundResume.quotes.details, a, b);
          foundResume.save(); 
          res.status(200).json({message: foundResume.quotes});
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