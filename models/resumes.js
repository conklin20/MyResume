var mongoose = require("mongoose");

//user schema 
var resumeSchema = new mongoose.Schema({
    alias: String,
    introduction: String,
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
        hideOnPrint: Boolean,
        details: [{
            category: String,
            categoryIcon: String,
            hideOnPrint: Boolean,
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
        hideOnPrint: Boolean,
        details: [{
            category: String,
            categoryIcon: String,
            hideOnPrint: Boolean,
            interest: []
        }]
    },
    experience: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        hideOnPrint: Boolean,
        details: [{
            companyName: String,
            title: String,
            startDate: Date,
            endDate: Date,
            city: String,
            state: String,
            url: String, 
            logo: String,
            hideOnPrint: Boolean,
            responsibilities: []
        }]
    },
    education: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        hideOnPrint: Boolean,
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
            hideOnPrint: Boolean,
            achievements: []
        }]
    },
    quotes: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        hideOnPrint: Boolean,
        details: [{
            quote: String, 
            by: String,
            hideOnPrint: Boolean
        }]
    },
    other: { 
        order: Number, 
        backgroundImg: String,
        fontColor: String,
        hideOnPrint: Boolean,
        details: [{
            title: String, 
            summary: String, 
            backgroundImg: String,
            fontColor: String,
            hideOnPrint: Boolean,
            bulletItems: []
        }]
    }
});


module.exports = mongoose.model("Resume", resumeSchema);
