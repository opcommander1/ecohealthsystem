var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    mysql           = require("mysql"),
    // Appointment = require("../models/appointment"),
    databaseOptions = require("../config/config.js")

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
router.get("/", function(req, res){
  //Get all appointments from debug
  var q = "SELECT * FROM appointments";
  con.query(q, function(error, allAppointments){
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



  var newAppointment = {first_name: fname, last_name: lname, phone: phone,
  appoint_day: appoint_day, appoint_time: appoint_time, doc_fname: doc_fname,
  appoint_time: appoint_time, doc_fname: doc_fname, doc_lname: doc_lname,
  reason: reason}

  //Create a new appointment and insert into DB
  var q = "INSERT INTO appointments (first_name, last_name, phone, appoint_day, appoint_time, doc_fname, reason) VALUES (newAppointment)";
  con.query(q, function(error, result){
  if(error) throw error;
  console.log("1 record inserted");
  //redirect to Appointment page
  res.redirect("/appointments");
  });
});



//New - show form to create new appointment
router.get("/new", function(req, res){
  res.render("appointments/new");
});



module.exports = router;
