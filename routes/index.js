var express           = require("express"),
    router            = express.Router(),
    passport          = require("passport"),
    User              = require("../models/user"),
    mysql             = require("mysql"),
    databaseOptions   = require("../config/config.js"),
    isLoggedIn        = require("../middleware")


const bcrypt = require('bcrypt');
const saltRounds = 10;

// database connectivity
var con = mysql.createConnection(databaseOptions);
//root route
router.get("/", function(req, res){
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render("landing");
});

//Show Login form
router.get("/login", function(req, res){
  res.render("login", {title: "Login"});
});

//Login Logic
router.post('/login', passport.authenticate(
  'local', {
  successRedirect: "/appointments",
  failureRedirect: "/login"

}));

//Logout logic
router.get('/logout', function(req, res){
  req.logout();
  req.flash("success", "Logged Out!");
  // req.session.destroy();
  res.redirect('/');
});

//show register form
router.get("/register", function(req, res){
  var first_name = req.body.fname;
  var last_name = req.body.lname;
  var title = req.body.title;
  var username = req.body.username;
  var pword = req.body.password;
  res.render("register",
  {title: 'Registration',
  fname: first_name,
  lname: last_name,
  title: title,
  username: username,
  });
});

//handle sign up logic
router.post("/register", function(req, res){
    var first_name = req.body.fname;
    var last_name = req.body.lname;
    var title = req.body.title;
    var username = req.body.username;
    var pword = req.body.password;

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('fname', 'First Name field cannot be empty.').notEmpty();
    req.checkBody('lname', 'Last Name field cannot be empty.').notEmpty();
    req.checkBody('password', 'Password field cannot be empty and must be 8 characters long.').len(8);
    const errors = req.validationErrors();

    if (errors){
      console.log(`errors: ${JSON.stringify(errors)}`);

      res.render('register',
      {title: 'Registration Error',
      errors: errors,
      fname: first_name,
      lname: last_name,
      title: title,
      username: username,
      });
    } else {


      //hash passowor
      bcrypt.hash(pword, saltRounds, function(err, hash) {
          con.query('INSERT INTO user(first_name, last_name, title, username, pword) VALUES (?, ?, ?, ?, ?)',
          [first_name, last_name, title, username, hash], function(error, results, fields){
          if (error) throw error;

          con.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields){
            if (error) throw error;

            const user_id = results[0];

            console.log(results[0]);
            req.login(user_id, function(err){
              res.redirect("/appointments");
            })
          });
        });
      });
    }
  });

  passport.serializeUser(function(user_id, done){
    done(null, user_id);
  });

  passport.deserializeUser(function(user_id, done){
    done(null, user_id);
  });

//   function authenticationMiddleware() {
// 	return (req, res, next) => {
// 		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
//
// 	    if (req.isAuthenticated()) return next();
// 	    res.redirect('/login')
// 	}
// }


//     User.register(newUser, req.body.password, function(err, user){
//       if(err){
//         return res.render("register");
//       }
//         passport.authenticate("local")(req, res, function(){
//         res.redirect("/");
//       });
//     });
// });


//Show Login logic
// router.post("/login", function(req, res){
//   res.render("appointments", {title: "Appointment"});
// })

// router.post("/login", passport.authenticate("local",
// {
//     successRedirect: "/appointments",
//     failureRedirect: "/login"
//   }), function(req, res){
// });

module.exports = router;
