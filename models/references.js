var mongoose    = require("mongoose");

//user schema 
var referenceSchema = new mongoose.Schema({
    name: { type: String, unique : true},
    company: String, 
    position: String, 
    phone: String, 
    email: String, 
    relationship: String, 
    note: String,
    writtenRef: String
}); 

module.exports = mongoose.model("Reference", referenceSchema);