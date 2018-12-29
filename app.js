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

var options = {
   host:          'us-cdbr-iron-east-01.cleardb.net',
   user:          'b0bc0a78d78226',
   password:      '59797ad0',
   database:      'heroku_839484e69cfdc0c'
};

// var options = {
//    host:          'localhost',
//    port:          3306,
//    localAddress:  '127.0.0.1',
//    socketPath:    '/Applications/MAMP/tmp/mysql/mysql.sock',
//    user:          'root',
//    password:      'root',
//    database:      'ecosystem'
// };

var sessionStore = new MySQLStore(options);

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

const PORT = process.env.PORT
app.listen(PORT, function(){
  console.log("Server has stated");
});
