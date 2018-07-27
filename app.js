var express                 = require('express'),
    mongoose                = require("mongoose"),
    flash                   = require("connect-flash"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    cookieParser            = require("cookie-parser"),
    expressSession          = require("express-session"),
    passport                = require('passport'),
    LinkedinStrategy        = require('passport-linkedin-oauth2').Strategy,
    //seedDB                  = require("./seed"),
    expressSanitizer        = require("express-sanitizer"),
    //forceSsl                = require('force-ssl-heroku'),
    app                     = express();

const ENV_TEST = false;

// **********************
// Hookup Routes
// **********************
var appIndex               = require("./routes/app/index"),
    appAuth                = require("./routes/app/auth"),
    appUsers               = require("./routes/app/user/user"),
    appCoverLetter         = require("./routes/app/user/cover-letter"),
    appReferences          = require("./routes/app/user/reference"),
    appResumeIndex         = require("./routes/app/build-resume/index"),
    // appBundle              : require("./routes/app/user/bundle")
    
    apiResumeIndex         = require("./routes/api/build-resume/index"),
    apiTimeline            = require("./routes/api/build-resume/timeline"),
    apiSkills              = require("./routes/api/build-resume/skills"),
    apiExperience          = require("./routes/api/build-resume/experience"),
    apiEducation           = require("./routes/api/build-resume/education"),
    apiInterests           = require("./routes/api/build-resume/interests"),
    apiProjects            = require("./routes/api/build-resume/projects"),
    apiQuotes              = require("./routes/api/build-resume/quotes"),
    apiOther               = require("./routes/api/build-resume/other"),
    apiUsers               = require("./routes/api/user/user"),
    apiCoverLetter         = require("./routes/api/user/cover-letter"),
    apiReferences          = require("./routes/api/user/reference"),
    apiData                = require("./routes/api/data/index");
    // apiBundle              = require("./routes/api/user/bundle"),

// creating an array of our routes, so we dont have to individually call app.use() to all of them (ln ~158)
var appRoutes = [appAuth, appUsers, appIndex, appCoverLetter, appReferences, appResumeIndex];
var apiRoutes = [apiResumeIndex, apiTimeline, apiSkills, apiExperience, apiEducation, apiInterests, apiProjects, apiQuotes, apiOther, apiUsers, apiCoverLetter, apiReferences, apiData];


// **********************
// Database Config
// Using environment variables here to distinguish between our test (Local C9) db version, and our "prod" or "deployed" (MLab) db version 
// In order to do so, we need to run the following commands to CREATE an environment variable in both enviornments 
// 1) For Cloud9, run cmd: export DATABASEURL=mongodb://localhost/yelp_camp
// 2) For Heroku, run cmd: heroku config:set DATABASEURL=mongodb://<username>:<password>@ds219318.mlab.com:19318/yelpcamp
//      OR: you can go to your Heroku account, and under settings of your app find "config vars" and manually add key: DATABASEURL value:  { heroku url string }
//      URL for this Heroku db: mongodb://<username>:<password>@ds219318.mlab.com:19318/yelpcamp
// **********************
if(ENV_TEST) {
    mongoose.connect("mongodb://localhost/MyResume_v3");
} else {
    mongoose.connect(process.env.DATABASECON || "mongodb://localhost/MyResume_v3");
} 

// **********************
// Various custom config
// **********************
// Needs to come before passport config
app.use(flash()); //used for our flash messages... this lib is pretty old so hold on
app.locals.moment = require('moment'); //MomentJS

// **********************
// Seteup Passport and LinkedIn-OAuth2
// **********************
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Linkedin profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// API Access link for creating client ID and secret:
// https://www.linkedin.com/secure/developer
var LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
var LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
var LINKEDIN_CALLBACK = process.env.LINKEDIN_CALLBACK; 

// Use the LinkedinStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Linkedin
//   profile), and invoke a callback with a user object.
passport.use(new LinkedinStrategy({
        clientID: LINKEDIN_CLIENT_ID,
        clientSecret: LINKEDIN_CLIENT_SECRET,
        callbackURL: LINKEDIN_CALLBACK || "https://personal-conklin20.c9users.io/auth/linkedin/callback",
        scope: ['r_basicprofile', 'r_emailaddress'],
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        req.session.accessToken = accessToken;
        process.nextTick(function() {
            return done(null, profile);
        });
    }
));

// **********************
// Configure Express
// **********************
app.set('views', [__dirname + '/views',
                  __dirname + '/views/build-resume', 
                  __dirname + '/views/user', 
                  __dirname + '/views/cover-letter',
                  __dirname + '/views/reference',
                  __dirname + '/views/prints']);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //MUST GO AFTER BODY PARSER 
app.use(cookieParser());
app.use(express.json());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use(methodOverride("_method")); //overriding HTML froms ability to only send POST and GET routes 

// **********************
//  Custom middleware 
// **********************
// global vars
app.use(function(req, res, next) {
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    res.locals.warning      = req.flash("warning");
    res.locals.testing      = ENV_TEST;
    next();
});

// **********************
// Use our Routes
// **********************
app.use(appRoutes); 
app.use(apiRoutes); 

//seed our db for testing only 
//seedDB();

// **********************
// Start the server
// **********************
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started...");
});
