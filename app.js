var express           = require("express"),
    app               = express(),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    methodOverride    = require("method-override"),
    mysql             = require("mysql"),
    databaseOptions   = require("./config/config.js"),
    expressValidator  = require("express-validator"),
    session           = require("express-session"),
    flash             = require("connect-flash"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    MySQLStore        = require("express-mysql-session") (session),
    bcrypt            = require("bcrypt"),
    userid            = require("./models/variables.js")
//requiring routes
var indexRoutes       = require("./routes/index"),
    appointmentRoutes = require("./routes/appointments")

//Global variable to store user id
global.globalUserid = undefined;
global.globalUsername = undefined;

//initiating app
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressValidator());

var sessionStore = new MySQLStore(databaseOptions);

//Passport Configuration
app.use(require("express-session")({
  secret: "jkljionhbhvvg",
  resave: false,
  store: sessionStore,
  saveUninitialized: false
}));

passport.use(new LocalStrategy(
    function(username, password, done) {
          console.log(username);
          console.log(password);
          globalUsername = username;
          var con = mysql.createConnection(databaseOptions);
          con.query('SELECT id, pword FROM user WHERE username = ?', [username], function(err, results, fields){
            if (err){done(err)};

            if (results.length === 0){
              done(null, false);
            } else {
              const hash = results[0].pword.toString();
              userid(results[0].id);
              console.log(results[0].id);
              globalUserid = results[0].id;
              console.log(globalUserid);

              bcrypt.compare(password, hash, function(err, response){
                if (response === true) {
                  return done(null, {user_id: results[0].id});
                } else {
                  return done(null, false);
                }
            });
          }
      })
    }
));

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info")
  next();
});

app.use("/", indexRoutes);
app.use("/appointments", appointmentRoutes);

// const PORT = process.env.PORT || 5000;
app.listen(5000, function(){
  console.log("Server has stated");
});
