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
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Resume"
            },
            title: String
        }
        ], 
    coverLetters: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CoverLetter"
            },
            title: String
        }
        ], 
    references: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reference"
            },
            title: String
        }
        ]
}); 

module.exports = mongoose.model("User", userSchema); 