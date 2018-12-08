var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user")

//database connectivity
mongoose.connect("mongodb://localhost/scheduler_v1");

//requiring routes
var indexRoutes       = require("./routes/index"),
    appointmentRoutes = require("./routes/appointments")

//initiating app
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Parssport Configuration
app.use(require("express-session")({
  secret: "Top secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/appointments", appointmentRoutes);

app.listen('8888', function(){
  console.log("Server has stated");
});
