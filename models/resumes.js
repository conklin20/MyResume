var mongoose = require("mongoose");

//user schema 
var resumeSchema = new mongoose.Schema({
    alias: String,
    elevatorPitch: String,
    objective: String,
    careerSummary: String,
    fontColor: String,
    timeline: [{
        date: Date,
        summary: String,
        detail: String,
        bannerImg: String,
        icon: String
    }],
    skills: [{
        category: String,
        skill: [{
            skillName: String,
            proficiency: Number
        }]
    }],
    interests: [],
    experience: [{
        companyName: String,
        title: String,
        startDate: Date,
        endDate: Date,
        city: String,
        state: String,
        responsibilities: []
    }],
    education: [{
        instituteName: String,
        city: String,
        state: String,
        startDate: Date,
        endDate: Date,
        degree: String,
        areaOfStudy: String,
        gpa: Number,
        achievements: [],
        notes: String,
        graduated: Boolean
    }], 
    other: [{
        title: String, 
        summary: String, 
        bulletItems: []
    }]
});

module.exports = mongoose.model("Resume", resumeSchema);
