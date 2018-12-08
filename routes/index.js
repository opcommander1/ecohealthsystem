var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");

//root route
router.get("/", function(req, res){
  res.render("landing");
});

//show register form
router.get("/register", function(req, res){
  res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username, fname: req.body.fname, lname: req.body.lname,
    title: req.body.title});
    User.register(newUser, req.body.password, function(err, user){
      if(err){
        return res.render("register");
      }
        passport.authenticate("local")(req, res, function(){
        res.redirect("/");
      });
    });
});

//Show Login form
router.get("/login", function(req, res){
  res.render("login");
});

//Show Login logic
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/appointments",
    failureRedirect: "/login"
  }), function(req, res){
});

module.exports = router;
