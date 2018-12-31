var express           = require("express"),
    router            = express.Router(),
    passport          = require("passport"),
    mysql             = require("mysql"),
    databaseOptions   = require("../config/config.js"),
    isLoggedIn        = require("../middleware"),
    userid            = require("../models/variables.js")
// database connectivity
var con = mysql.createConnection(databaseOptions);


//Index - show all appointments
router.get("/", isLoggedIn(), function(req, res){
    //Get all appointments from debug
    con.query("SELECT appointments.id, appointments.first_name, appointments.last_name, appointments.phone, appoint_day, TIME_FORMAT(appointments.appoint_time, '%h:%i %p') AS appoint_time, CONCAT(appointments.doc_fname,' ', appointments.doc_lname) AS doc_full, appointments.reason, user.username, appointments.create_date FROM appointments JOIN user ON user.id = appointments.user_id WHERE appointments.user_id = ? Order By appointments.appoint_day",
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
  req.checkBody('fname', "First Name cannot be empty").notEmpty();
  req.checkBody('lname', "Last Name cannot be empty").notEmpty();
  req.checkBody('phone', "Phone cannot be empty and must be 10 digits").notEmpty()
  req.checkBody('appoint_time', "Time field cannot be empty").notEmpty();
  req.checkBody('appoint_day', "Date field cannot be empty").notEmpty();
  req.checkBody('doc_fname', "Doctor First Name field cannot be empty").notEmpty();
  req.checkBody('doc_lname', "Doctor Last Name field cannot be empty").notEmpty();
  const errors = req.validationErrors();

  if (errors){
      console.log(`errors: ${JSON.stringify(errors)}`);
      res.render('appointments/new',
      {title: 'Appointment Errors',
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
      res.redirect("/appointments");
      });
    };
  });

//New - show form to create new appointment
router.get("/new", function(req, res){
  var fname = req.body.fname;
  var lname = req.body.lname;
  var phone = req.body.phone;
  var appoint_day = req.body.appoint_day;
  var appoint_time = req.body.appoint_time;
  var doc_fname = req.body.doc_fname;
  var doc_lname = req.body.doc_lname;
  var reason = req.body.reason;
  res.render("appointments/new", {
    fname: fname,
    lname: lname,
    phone: phone,
    appoint_time: appoint_time,
    appoint_day: appoint_day,
    doc_fname: doc_fname,
    doc_lname: doc_lname,
    reason: reason
  });
});

//Edit Appointment Record
router.get("/:id/edit", isLoggedIn(), function(req, res){
    con.query('SELECT * FROM appointments WHERE id = ?',
    [req.params.id], function(errors, foundAppointment){
      if(errors || !foundAppointment[0]){
        req.flash("errors", "No Appointment found");
        res.redirect("/appointments");
      } else {
      res.render("appointments/edit", {appointment: foundAppointment[0]});
    }
  });
});

//Update Appointment Record
router.put("/:id", isLoggedIn(), function(req, res){

  var id = req.params.id;
  var first_name = req.body.fname;
  var last_name = req.body.lname;
  var phone = req.body.phone;
  var appoint_day = req.body.appoint_day;
  var appoint_time = req.body.appoint_time;
  var doc_fname = req.body.doc_fname;
  var doc_lname = req.body.doc_lname;
  var reason = req.body.reason;

  //Keep information in field if there validation errors
  entryUpdate = {
    id,
    first_name,
    last_name,
    phone,
    appoint_day,
    appoint_time,
    doc_fname,
    doc_lname,
    reason
  }

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

  if(errors){
    console.log(`errors: ${JSON.stringify(errors)}`);
    req.session.errors = errors;
    req.session.success = false;
    res.render("appointments/edit", {appointment: entryUpdate, errors: errors});
  } else {
  con.query('UPDATE appointments SET first_name = ?, last_name = ?, phone = ?, appoint_day = ?, appoint_time = ?, doc_fname = ?, doc_lname = ?, reason = ? WHERE id = ?',
  [req.body.fname, req.body.lname, req.body.phone, req.body.appoint_day, req.body.appoint_time, req.body.doc_fname, req.body.doc_lname, req.body.reason, req.params.id],
  function(errors, updateAppointment){
    if(errors) throw errors;
    req.session.seccess = true;
    req.flash("info", "1 record updated");
    res.redirect("/appointments");
  });
}
});

//Delete Record
router.delete("/:id", isLoggedIn(), function(req, res){
  con.query('DELETE FROM appointments WHERE id = ?',
  [req.params.id], function(errors, result){
    if (errors){
      req.flash("info", "No record deleted");
      console.log(errors);
      res.render("appointments");
    } else {
      req.flash("info", "1 record deleted")
      res.redirect("/appointments");
    }
  });
});


module.exports = router;
