var mongoose                = require("mongoose"), 
    passportLocalMongoose   = require("passport-local-mongoose");

//user schema 
var education = new mongoose.Schema({
    instituteName: String, 
    city: String, 
    state: String, 
    startDate: Date, 
    endDate: Date, 
    degree: String, 
    areaOfStudy: String, 
    achievments: String, 
    notes: String, 
    graduated: Boolean
}); 

education.plugin(passportLocalMongoose); 

module.exports = mongoose.model("Education", education); 