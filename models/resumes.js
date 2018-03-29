var mongoose = require("mongoose");

//user schema 
var resumeSchema = new mongoose.Schema({
    alias: String,
    elevatorPitch: String,
    objective: String,
    careerSummary: String,
    backgroundImg: String,
    fontColor: String,
    timeline: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        details: [{
            date: Date,
            summary: String,
            detail: String,
            icon: String
        }]
    },
    skills: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        details: [{
            category: String,
            categoryIcon: String,
            skill: [{
                skillName: String,
                proficiency: Number
            }]
        }]
    },
    interests: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        details: [{
            category: String,
            categoryIcon: String,
            interest: []
        }]
    },
    experience: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        details: [{
            companyName: String,
            title: String,
            startDate: Date,
            endDate: Date,
            city: String,
            state: String,
            url: String, 
            logo: String, 
            responsibilities: []
        }]
    },
    education: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        details: [{
            instituteName: String,
            city: String,
            state: String,
            startDate: Date,
            endDate: Date,
            degree: String,
            areaOfStudy: String,
            gpa: Number,
            notes: String,
            graduated: Boolean,
            url: String, 
            logo: String, 
            achievements: []
        }]
    },
    quotes: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        details: [{
            quote: String, 
            by: String
        }]
    },
    other: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        details: [{
            title: String, 
            summary: String, 
            backgroundImg: String,
            fontColor: String,
            bulletItems: []
        }]
    }
});


module.exports = mongoose.model("Resume", resumeSchema);
