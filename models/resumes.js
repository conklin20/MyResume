var mongoose                = require("mongoose"), 
    passportLocalMongoose   = require("passport-local-mongoose");

//user schema 
var resumeSchema = new mongoose.Schema({
    email: String,
    phone: String, 
    objective: String, 
    education: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Education"
        }
        ]
}); 

resumeSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("Resume", resumeSchema); 