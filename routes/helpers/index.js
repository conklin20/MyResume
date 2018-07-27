var User            = require("../../models/users"),
    Resume          = require("../../models/resumes"),
    CoverLetter     = require("../../models/coverletters")
    
// these helpers arent being used yet 7/11/2018

// Users Model helpers
// exports.getUser = function(req, res){
//     User.findById(req.params.userId)
//     .then(function(foundUser){
//         return res.status(201).json(foundUser);
//     })
//     .catch(function(err){
//         res.status(500).json(err);
//     });
// };

exports.getUser = function(userId){
    console.log(userId); 
    User.findById(userId)
    .then(function(foundUser){
        console.log(foundUser.username);
        return User;
    })
    .catch(function(err){
        console.log(err);
    });
};

exports.getAllUser = function(req, res){
    User.find()
    .then(function(users){
        res.status(201).json(users);
    })
    .catch(function(err){
        res.status(500).json(err);
    });
};

// Resume Model helpers
exports.getResume = function(req, res){
    Resume.findById(req.params.resumeId)
    .then(function(foundResume){
        res.status(201).json(foundResume);
    })
    .catch(function(err){
        res.status(500).json(err);
    });
};

exports.getUserAndResume = function(req, res){
    User.findById(req.params.userId)
    .then(function(foundUser){
        Resume.findById(req.params.resumeId)
        .then(function(foundResume){
            console.log(foundUser)
            console.log(foundResume); 
            res.status(201).json({ user: foundUser, resume: foundResume, coverLetter: null });
            // res.render('index', { user: foundUser, resume: foundResume, coverLetter: null }); 
        })
        .catch(function(err){
            res.status(500).json(err);
        });
    })
    .catch(function(err){
        res.status(500).json(err);
    });
};


exports.getAllUserResumes = function(req, res){
    var resumes = [];
    User.findById(req.params.userId)
    .then(function(foundUser){
        foundUser.resumes.forEach(function(resume){
            Resume.findById(resume._id)
            .then(function(foundResume){
                // res.status(201).json(foundResume);
                resumes.push(foundResume); 
            })
            .catch(function(err){
                res.status(500).json(err);
            });
        });
    })
    .then(function(data){
        console.log(data)
        console.log(resumes)
        res.status(201).json(resumes);
    })
    .catch(function(err){
        res.status(500).json(err);
    });
};

// CoverLetter Model helpers




