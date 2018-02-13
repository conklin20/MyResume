var express           = require('express')
  , passport          = require('passport')
  , bodyParser        = require("body-parser")
  , methodOverride    = require("method-override")
  , cookieParser      = require("cookie-parser")
  , expressSession    = require("express-session")
  //,LinkedinStrategy = require('../lib').Strategy;
  , LinkedinStrategy  = require('passport-linkedin-oauth2').Strategy
  , app               = express();

// **********************
// Hookup Routes
// **********************
var accountRoutes     = require("./controllers/routes/account"),
    authRoutes        = require("./controllers/routes/auth"),
    indexRoutes       = require("./controllers/routes/index");

// **********************
// SSeteup Passport and LinkedIn-OAuth2
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
var LINKEDIN_CLIENT_ID = "78dyjfwqjl6rpm";
var LINKEDIN_CLIENT_SECRET = "JszVmdQI2cepCwj3";

// Use the LinkedinStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Linkedin
//   profile), and invoke a callback with a user object.
passport.use(new LinkedinStrategy({
    clientID:     LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL:  "https://personal-conklin20.c9users.io/auth/linkedin/callback",
    scope:        [ 'r_basicprofile', 'r_emailaddress'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    req.session.accessToken = accessToken;
    process.nextTick(function () {
      // To keep the example simple, the user's Linkedin profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Linkedin account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// **********************
// Configure Express
// **********************
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})); 
// app.use(express.logger());
app.use(cookieParser());
// app.use(express.urlencoded());
app.use(express.json());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method")); //overriding HTML froms ability to only send POST and GET routes 

// **********************
// Use our Routes
// **********************
app.use(accountRoutes); 
app.use(authRoutes); 
app.use(indexRoutes); 

// **********************
// Start the server
// **********************
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});