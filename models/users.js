var mongoose    = require("mongoose");

//user schema 
var userSchema = new mongoose.Schema({
    // Imported from LinkedIn
    username: String, 
    firstName: String, 
    lastName: String, 
    email: String,
    linkedInURL: String,
    linkedInID: String, 
    // Custom fields
    phone: String,
    avatar: String, 
    bannerImg: String, 
    resumes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume"
        }
    ], 
    coverLetters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CoverLetter"
        }
    ], 
    references: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reference"
        }
    ]
}); 


module.exports = mongoose.model("User", userSchema); 