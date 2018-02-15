var mongoose    = require("mongoose");

//user schema 
var resumeSchema = new mongoose.Schema({
    alias: String, 
    elevatorPitch: String,
    objective: String,
    careerSummary: String, 
    timeline: [
        {
            date: Date, 
            summary: String, 
            detail: String, 
            bannerImg: String, 
            icon: String 
        }
        ],
    skills: [
        {
            category: String, 
            skill: [
                {
                    String, 
                    proficiency: []
                }
            ]    
        }
        ],
    experience: [
        {
            companyName: String, 
            title: String, 
            startDate: Date, 
            endDate: Date, 
            responsibility: [
                String
                ],
            achievment: [
                String
                ]
        }
        ],
    education: [
        {
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
        }
        ]
}); 

module.exports = mongoose.model("Resume", resumeSchema); 