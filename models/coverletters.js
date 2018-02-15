var mongoose    = require("mongoose");

//user schema 
var userSchema = new mongoose.Schema({
    title: String, 
    body: String
}); 

module.exports = mongoose.model("CoverLetter", userSchema);