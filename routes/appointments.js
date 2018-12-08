var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var Appointment = require("../models/appointment");

//Index - show all appointments
router.get("/", function(req, res){
  //Get all appointments from debug
  Appointment.find({}, function(err, allAppointments){
    if(err){
      console.log(err);
    } else {
      res.render("appointments/show", {appointments: allAppointments});
    }
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
  var create_Date = req.body.create_Date;


  var newAppointment = {fname: fname, lname: lname, phone: phone,
  appoint_day: appoint_day, appoint_time: appoint_time, doc_fname: doc_fname,
  appoint_time: appoint_time, doc_fname: doc_fname, doc_lname: doc_lname,
  reason: reason, create_Date: create_Date}

  //Create anew appointment and save to DB
  Appointment.create(newAppointment, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      //redirect to Appointment page
      res.redirect("/appointments");
    }
  });
});

//New - show form to create new appointment
router.get("/new", function(req, res){
  res.render("appointments/new");
});



module.exports = router;
