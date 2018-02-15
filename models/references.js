var mongoose    = require("mongoose");

//user schema 
var userSchema = new mongoose.Schema({
    title: String, 
    name: String, 
    company: String, 
    position: String, 
    phone: String, 
    email: String, 
    relationship: String, 
    note: String,
    writtenRef: String
}); 

module.exports = mongoose.model("Reference", userSchema);