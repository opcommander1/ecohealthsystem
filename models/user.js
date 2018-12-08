var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  title: String,
  username: String,
  password: String,
  authorid: {type: mongoose.Schema.Types.ObjectId, ref:'appointment'}
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
