var          mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose'),
       getCurrentDate = require('../routes/users').getCurrentDate;

let curDate = getCurrentDate();

var UserSchema = new mongoose.Schema({ // schema for user data
  email: {type: String, minlength: 8, maxlength: 60},
  username: {type: String, minlength: 5, maxlength: 25},
  password: {type: String, minlength: 5, maxlength: 25},
  firstName: {type: String, minlength: 1, maxlength: 40},
  lastName: {type: String, minlength: 1, maxlength: 50},
  phone: {type: String, minlength: 10, maxlength: 20},
  birthday: {type: Date, min: "1900-01-01", max: "2020-06-01"},
  created: {type: Date, default: curDate},
  lastLogin: {type: Date, default: curDate},
  loginStreak: {type: Number, default: 1},
  coins: {type: Number, default: 100},
  highestWin: {type: Number, default: 0},
  passwordRecoveryActive: {type: Boolean, default: false},
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);