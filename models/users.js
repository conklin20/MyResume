var mongoose    = require("mongoose");

//user schema 
var userSchema = new mongoose.Schema({
    // Imported from LinkedIn
    linkedinUsername: String, 
    linkedinFirstName: String, 
    linkedinLastName: String, 
    linkedinEmail: String,
    linkedinURL: String,
    linkedinID: String, 
    // Custom fields
    username: { type: String, unique : true, dropDups: true },
    phone: String,
    city: String, 
    state: String, 
    avatar: String, 
    facebookURL: String, 
    instagramURL: String, 
    twitterURL: String, 
    githubURL: String,
    defaults: {
        resume: String, //mongoose.Schema.Types.ObjectId, 
        coverLetter: String, //mongoose.Schema.Types.ObjectId,
        printTheme: String, 
        printFontSize: Number 
    },
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
    ], 
    bundles: [
        {
            alias: { type: String },
            resumeId: mongoose.Schema.Types.ObjectId,
            coverLetterId: mongoose.Schema.Types.ObjectId,
            expiresOn: Date
        }
    ]
}); 


module.exports = mongoose.model("User", userSchema); 