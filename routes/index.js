var express           = require("express"),
    router            = express.Router(),
    passport          = require("passport"),
    User              = require("../models/user"),
    mysql             = require("mysql"),
    databaseOptions   = require("../config/config.js"),
    expressValidator  = require('express-validator')

// database connectivity
var con = mysql.createConnection(databaseOptions);
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

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('fname', 'First Name field cannot be empty.').notEmpty();
    req.checkBody('lname', 'Last Name field cannot be empty.').notEmpty();
    req.checkBody('password', 'Password field must be 8 characters long.').notEmpty().len(8);
    const errors = req.validationErrors();

    if (errors){
      console.log(`errors: ${JSON.stringify(errors)}`);

      res.render('register', {title: 'Registration Error', errors: errors
      });
    } else {
      var first_name = req.body.fname;
      var last_name = req.body.lname;
      var title = req.body.title;
      var username = req.body.username;
      var pword = req.body.password;

      con.query('INSERT INTO user(first_name, last_name, title, username, pword) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, title, username, pword], function(error, results, fields){
      if (error) throw error;
      res.redirect("/");
      });
    }
  });
//     User.register(newUser, req.body.password, function(err, user){
//       if(err){
//         return res.render("register");
//       }
//         passport.authenticate("local")(req, res, function(){
//         res.redirect("/");
//       });
//     });
// });

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
