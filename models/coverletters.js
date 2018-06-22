var mongoose    = require("mongoose"),
    User        = require("./users");

//user schema 
var coverLetterschema = new mongoose.Schema({
    title: { type: String, unique : true}, 
    body: String
}); 


// coverLetterschema.pre('remove', function(next) {
//     // 'this' is the Cover Letter being removed. Provide callbacks here if you want
//     // to be notified of the calls' result.
//     User.remove({coverLetter_id: this._id}).exec();
//     next();
// });

module.exports = mongoose.model("CoverLetter", coverLetterschema);