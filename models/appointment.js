var mongoose = require("mongoose");

var appointmentSchema = new mongoose.Schema({

    fname: {type: String, require: true},
    lname: {type: String, require: true},
    phone: {type: String, require: true},
    appoint_day: {type: Date, require: true},
    appoint_time: {type: String, require: true},
    doc_fname: {type: String, require: true},
    doc_lname: {type: String, require: true},
    reason: String,
    createDate: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: {type: String}
});

module.exports = mongoose.model("Appointment", appointmentSchema);
