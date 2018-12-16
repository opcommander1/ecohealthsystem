var express           = require("express"),
    router            = express.Router(),
    passport          = require("passport"),
    mysql             = require("mysql"),
    // Appointment = require("../models/appointment"),
    databaseOptions   = require("../config/config.js"),
    isLoggedIn        = require("../middleware"),
    userid            = require("../models/variables.js")
// database connectivity
var con = mysql.createConnection(databaseOptions);


// con.connect(function(err){
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "CREATE TABLE test (username VARCHAR(255))";
//   con.query(sql, function (err, result){
//     if (err) throw err;
//     console.log("Table created");
//   });
// });

//Index - show all appointments
router.get("/", isLoggedIn(), function(req, res){
  //Get all appointments from debug
  con.query("SELECT appointments.first_name, appointments.last_name, appointments.phone, appoint_day, appointments.appoint_time, CONCAT(appointments.doc_fname,' ', appointments.doc_lname) AS doc_full, appointments.reason, user.username, appointments.create_date FROM appointments JOIN user ON user.id = appointments.user_id WHERE appointments.user_id = ?",
  [globalUserid], function(error, allAppointments){
  if(error) throw error;
  res.render("appointments/show", {appointments: allAppointments});
  });
});


//CREATE - add new appointment to DB
router.post("/", function(req, res){
  //get data from new form and add to appointments array
  var fname = req.body.fname;
  var lname = req.body.lname;
  var phone = req.body.phone;
  var appoint_day = req.body.appoint_day;
  var appoint_time = req.body.appoint_time;
  var doc_fname = req.body.doc_fname;
  var doc_lname = req.body.doc_lname;
  var reason = req.body.reason;

  //Validates input
  req.checkBody('fname', "First Name field cannot be empty").notEmpty();
  req.checkBody('lname', "Last Name field cannot be empty").notEmpty();
  req.checkBody('phone', "Phone field cannot be empty").notEmpty();
  req.checkBody('phone', "Phone field must be 10 digits").len(10);
  req.checkBody('phone', "Phone field must be numric").isNumeric();
  req.checkBody('appoint_time', "Time field cannot be empty").notEmpty();
  req.checkBody('appoint_day', "Date field cannot be empty").notEmpty();
  req.checkBody('doc_fname', "Doctor First Name field cannot be empty").notEmpty();
  req.checkBody('doc_lname', "Doctor Last Name field cannot be empty").notEmpty();
  const errors = req.validationErrors();

  if (errors){
    console.log(`errors: ${JSON.stringify(errors)}`);
    res.render('appointments/new',
    {title: 'Appointment Error',
    errors: errors,
    fname: fname,
    lname: lname,
    phone: phone,
    appoint_time: appoint_time,
    appoint_day: appoint_day,
    doc_fname: doc_fname,
    doc_lname: doc_lname,
    reason: reason
    });
  } else {

  //Create a new appointment and insert into DB
  con.query('INSERT INTO appointments(first_name, last_name, phone, appoint_day, appoint_time, doc_fname, doc_lname, reason, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [fname, lname, phone, appoint_day, appoint_time, doc_fname, doc_lname, reason, globalUserid], function(error, results){
  if(error) throw error;
  console.log("1 record inserted");
  req.flash("info", "1 record inserted");
  //redirect to Appointment page
  res.redirect("/appointments", {title: "Appointments"});
      });
    };
  });




//New - show form to create new appointment
router.get("/new", function(req, res){
  res.render("appointments/new");
});



module.exports = router;
