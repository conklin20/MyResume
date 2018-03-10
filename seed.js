var mongoose        = require("mongoose"),
    User            = require("./models/users"),
    CoverLetter     = require("./models/coverletters"),
    Reference       = require("./models/references"),
    Resume          = require("./models/resumes");
    
var data = [
    {
        username:       "cary-conklin-75678333", 
        firstName:      "Cary", 
        lastName:       "Conklin", 
        email:          "cary.conklin.20@gmail.com", 
        linkedInURL:    "https://www.linkedin.com/in/cary-conklin-75678333/",
        linkedInID:     "vxv6h1vO7e",
        phone:          "(208) 553-3375",
        city:           "Austin", 
        state:          "TX",
        avatar:         "https://render.bitstrips.com/v2/cpanel/eb1a2ea1-7c1f-4a92-abdb-e89cdc52edfd-46176deb-5155-42f0-9670-06ef196f63b5-v1.png?transparent=1&palette=1",
        bannerImg:      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e4bbb31a47384880bb5d5c292e4b401d&auto=format&fit=crop&w=1350&q=80"
    }, 
    {
        username:       "isaac-woodbury-a1941178", 
        firstName:      "Isaac", 
        lastName:       "Woodbury", 
        email:          "cary_conklin_88@msn.com", 
        linkedInURL:    "https://www.linkedin.com/in/isaac-woodbury-a1941178",
        linkedInID:     "dsfsdfsafopjrer",
        phone:          "(509) 552-9999",
        city:           "Seattle", 
        state:          "WA",
        avatar:         "https://scontent.fmkc1-1.fna.fbcdn.net/v/t1.0-9/11999095_10155998011855375_4633463793433419522_n.jpg?oh=fcd9b37ab23e4560f8f3e86771db56e9&oe=5B25FC4C",
        bannerImg:      "https://scontent.fmkc1-1.fna.fbcdn.net/v/t31.0-8/10517439_10154566391910386_1525981640510952104_o.jpg?oh=8c5e58fad3710380f826d84409ad024d&oe=5B2136B4"
    },     
    {
        username:       "cconklin", 
        firstName:      "Chad", 
        lastName:       "Conklin", 
        email:          "cary.conklin.20@gmail.com", 
        linkedInURL:    "https://www.linkedin.com/in/cconklin",
        linkedInID:     "sdsadgrbberw",
        phone:          "(509) 552-1234",
        city:           "Spokane", 
        state:          "WA",
        avatar:         "https://media.licdn.com/media/p/5/005/0a9/349/1ce5cd6.jpg",
        bannerImg:      "https://scontent.fmkc1-1.fna.fbcdn.net/v/t31.0-8/10517439_10154566391910386_1525981640510952104_o.jpg?oh=8c5e58fad3710380f826d84409ad024d&oe=5B2136B4"
    }
];


function seedDB(){
   //Remove all campgrounds
   User.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Users!");
        CoverLetter.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed Cover Letters!");
            Reference.remove({}, function(err) {
                if(err){
                    console.log(err);
                }
                console.log("removed References!");
                Resume.remove({}, function(err){
                    if(err){
                        console.log(err);
                    }
                    console.log("removed Resumes!");
                    
                    //add a few Users
                    data.forEach(function(seed){
                        User.create(seed, function(err, newUser){
                            if(err){
                                console.log(err);
                            } else {
                                console.log("added a User - " + newUser._id);
                                
                                //COVER LETTERS
                                //create a CL
                                CoverLetter.create(
                                    {
                                        title: newUser.firstName + "'s Cover Letter Sample 1",
                                        body: "This is where you would write a letter customized to a particular employer"
                                    }, function(err, newCoverLetter){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            newUser.coverLetters.push(newCoverLetter._id);
                                            console.log(newUser.firstName + " - Created new Cover Letter");
                                            
                                            //create another CL
                                            CoverLetter.create(
                                                {
                                                    title: newUser.firstName + "'s Cover Letter Sample 2",
                                                    body: "This is where you would write a letter customized to a particular employer"
                                                }, function(err, newCoverLetter){
                                                    if(err){
                                                        console.log(err);
                                                    } else {
                                                        newUser.coverLetters.push(newCoverLetter._id);
                                                        console.log(newUser.firstName + " - Created a 2nd Cover Letter");
                                                        
                                                        // REFERENCES
                                                        //create a Ref
                                                        Reference.create(
                                                            {
                                                                name: 'Bill Mackleit', 
                                                                company: 'Vista Outdoor', 
                                                                position: 'Director of Operations', 
                                                                phone: '2085555555', 
                                                                email: 'bill@vsto.com', 
                                                                relationship: 'reported to bill', 
                                                                note: 'super awesome guy'
                                                            }, function(err, newReference){
                                                                if(err){
                                                                    console.log(err);
                                                                } else {
                                                                    newUser.references.push(newReference._id);
                                                                    console.log(newUser.firstName + " - Created new Reference");
                                                                    
                                                                    //create another CL
                                                                    Reference.create(
                                                                        {
                                                                            name: 'Kevin Hermann', 
                                                                            company: 'AgriBeef Co.', 
                                                                            position: 'Sr. Programmer', 
                                                                            phone: '2085769293', 
                                                                            email: 'kevin@vsto.com', 
                                                                            relationship: 'direct report', 
                                                                            note: 'super smart',
                                                                            writtenRef: "I was involved with hiring, onboarding, and training Cary at Vista Outdoor. At that time we were starting a large scale project in IT and I was part of the project team. I was immediately impressed by how much Cary was able to take on and how quickly he was able to come up to speed. Unfortunately I didn't have much time to devote to Cary, but he was able to work effectively with the business to identify their needs  and deliver solutions without my intervention. As I worked with Cary over the years the trait that I admired most was his sense of calm, no matter what was thrown his way he handled it very well. Cary is also a hard worker, willing to put in extra time to get the project done or issue resolved without a second thought. Cary's technical knowledge allowed him to effectively and consistently deliver what the business requested at Vista Outdoor. Cary would be an asset to any team, I am happy to have had the opportunity to work with him."
                                                                        }, function(err, newReference){
                                                                            if(err){
                                                                                console.log(err);
                                                                            } else {
                                                                                newUser.references.push(newReference._id);
                                                                                console.log(newUser.firstName + " - Created a 2nd Reference");
                                                                                
                                                                                // Create a Resume 
                                                                                var resume = { 
                                                                                    alias: newUser.firstName + " " +  newUser.lastName + " Resume",
                                                                                    elevatorPitch: "I am the hardest working fella you'll meet... you;'re gonna want to hire me!", 
                                                                                    objective: "My objective is to deprecate this section of the resume", 
                                                                                    timeline: [
                                                                                            {
                                                                                                date: '05/01/2012', 
                                                                                                summary: "I graduated from Washington State University!", 
                                                                                                detail: "I walked in a very boring graduation ceremony in May of 2012 graduating from Washington State University with a degree in Management Information Systems",
                                                                                                bannerImg: "http://res.cloudinary.com/caryconklin/image/upload/v1518971600/Diploma_vkaleq.jpg", 
                                                                                                icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Graduation_cap.png"
                                                                                            },
                                                                                            {
                                                                                                date: '08/20/1989', 
                                                                                                summary: newUser.firstName + " was brought into this world on this day!", 
                                                                                                detail: "You dont want to know the details of this event",
                                                                                                bannerImg: "", 
                                                                                                icon: "https://emojipedia-us.s3.amazonaws.com/thumbs/120/whatsapp/116/baby_emoji-modifier-fitzpatrick-type-1-2_1f476-1f3fb_1f3fb.png"
                                                                                            },
                                                                                            {
                                                                                                date: '12/01/2017', 
                                                                                                summary: "I moved down to Austin, TX!", 
                                                                                                detail: "I decided to quit my job with Vista Outdoor and make the move from Washington State down to Austin! ",
                                                                                                bannerImg: "https://images.unsplash.com/photo-1489364929346-a1d324ff812b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2eef26c094e9a16dca10727c9b139868&auto=format&fit=crop&w=1350&q=80", 
                                                                                                icon: "https://image.flaticon.com/icons/png/128/602/602201.png"
                                                                                            },
                                                                                            {
                                                                                                date: '06/01/2012', 
                                                                                                summary: "I started working at Vista Outdoor.", 
                                                                                                detail: "I was hired on as a temp, but later converted to full time in October.",
                                                                                                bannerImg: "http://www.lcvalleychamber.org/wp-content/uploads/2016/06/Vista-Outdoor-CCI-Speer.jpg", 
                                                                                                icon: "https://crunchbase-production-res.cloudinary.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/v1438076533/ouy3xuotncsc3rzhpzsl.png"
                                                                                            }
                                                                                        ], 
                                                                                    skills: [
                                                                                            {
                                                                                                category: "Languages",
                                                                                                skill: [
                                                                                                        { skillName: "C#", proficiency: 4.5 },
                                                                                                        { skillName: "T-SQL", proficiency: 4.5 },
                                                                                                        { skillName: "HTML", proficiency: 4 },
                                                                                                        { skillName: "CSS", proficiency: 3.5 },
                                                                                                        { skillName: "JavaScript", proficiency: 3.5 },
                                                                                                        { skillName: "Java", proficiency: 1 }
                                                                                                    ]
                                                                                            }, 
                                                                                            {
                                                                                                category: "Frameworks & Libraries",
                                                                                                skill: [
                                                                                                        { skillName: "ASP.NET", proficiency: 3.5 },
                                                                                                        { skillName: "EF6", proficiency: 3 },
                                                                                                        { skillName: "Angular", proficiency: 3 },
                                                                                                        { skillName: "Node.js", proficiency: 3.5 },
                                                                                                        { skillName: "jQuery", proficiency: 3 },
                                                                                                        { skillName: "Express", proficiency: 3.5 },
                                                                                                        { skillName: "NPM", proficiency: 3.5 },
                                                                                                        { skillName: "Bootstrap", proficiency: 3.5 },
                                                                                                        { skillName: "Flexbox", proficiency: 3 }
                                                                                                    ]
                                                                                            }, 
                                                                                            {
                                                                                                category: "Non-Technical Skills",
                                                                                                skill: [
                                                                                                        { skillName: "Effectively communicate with technical and non-technical users to gather requirements or troubleshoot issues"},
                                                                                                        { skillName: "Escalate issues and/or information when necessary"},
                                                                                                        { skillName: "Can work well in a team environment and knows the value others bring" },
                                                                                                        { skillName: "Can work well as an individual contributor – communicates essential information with teams" },
                                                                                                        { skillName: "Listens well" },
                                                                                                        { skillName: "Welcome to change, and new challenges, with a drive to achieve the desired outcomes" },
                                                                                                        { skillName: "Desire to continually grow my skillset and learn new things" }
                                                                                                    ]
                                                                                            }
                                                                                        ],
                                                                                    interests: ["DMB", "Music", "Sports", "Learning & Development", "Travel", "More cool shit.."],
                                                                                    experience: [
                                                                                            {
                                                                                                companyName: "Vista Outdoor", 
                                                                                                title: "Applications Developer III",
                                                                                                startDate: "06/01/2012",
                                                                                                endDate: "10/01/2017",
                                                                                                city: 'Lewiston',
                                                                                                state: 'ID',
                                                                                                responsibilities: [
                                                                                                        "Administered a custom application portfolio of applications tailored mostly towards manufacturing and operations business functions, a division of ~2500 employees <ul><li>This portfolio primarily consisted of ASP.NET web applications written in C#, JavaScript, HTML, and CSS, with an underlying SQL Server database</li></ul>",
                                                                                                        "Streamlined data collection processes such as production reporting, machine downtime reporting, and lot tracking by developing a system comprised of custom windows services, windows forms applications, web applications, and reporting",
                                                                                                        "Transformed the shop floor into a visual factory by delivering real-time data using PowerBI and SSRS dashboards, which utilized real-time data collected from the system outlined in the previous bullet", 
                                                                                                        "Developed the core QA testing application that provided our quality departments the data needed to identify, and correct key quality issues in our product"
                                                                                                    ]
                                                                                            }
                                                                                        ],
                                                                                    education: [
                                                                                            {
                                                                                                instituteName: "Washington State University",
                                                                                                city: "Pullman",
                                                                                                state: "WA", 
                                                                                                startDate: "08/01/2010", 
                                                                                                endDate: "05/01/2012", 
                                                                                                degree: "Bachelors of Arts", 
                                                                                                areaOfStudy: "Management Information Systems", 
                                                                                                gpa: 3.2,
                                                                                                achievements: [
                                                                                                    "Achieved a 3.2 GPA", "Member of Tau Sigma Honor Society", "Daily occupant of the rec center"
                                                                                                    ],
                                                                                                graduated: true
                                                                                            },
                                                                                            {
                                                                                                instituteName: "Spokane Community College",
                                                                                                city: "Spokane",
                                                                                                state: "WA", 
                                                                                                startDate: "09/01/2008", 
                                                                                                endDate: "06/01/2010", 
                                                                                                degree: "Associates of Arts", 
                                                                                                areaOfStudy: "Business", 
                                                                                                gpa: 3.3,
                                                                                                achievements: [
                                                                                                    "Achieved a 3.3 GPA", "Member of SCC's basketball team"
                                                                                                    ],
                                                                                                graduated: true
                                                                                            }
                                                                                        ]
                                                                                }
                                                                                Resume.create(resume, function(err, newResume){
                                                                                   if(err){
                                                                                       console.log(err);
                                                                                   } else {
                                                                                        newUser.resumes.push(newResume._id);
                                                                                        console.log(newUser.firstName + " - Created a Resume: " + newResume._id);
                                                                                        
                                                                                        
                                                                                        //SAVE All the docs to the user
                                                                                        newUser.save();
                                                                                        console.log("Saved " + newUser.firstName + "'s child documents");
                                                                                   }
                                                                                });
                                                                            }
                                                                        });
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                    });
                });
            }); 
        });
    }); 
}

module.exports = seedDB;