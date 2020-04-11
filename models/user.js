var          mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose'),
moment                = require('moment');

function getCurrentDate() {
  let adjustedTime = moment().hour()+(moment().utcOffset()/60);
  let todayDate = moment().date();
  if (adjustedTime < 0) {
    todayDate = (moment().date()-1);
    adjustedTime = (24 + adjustedTime);
  }
  let dateReturned = moment().year() + '-'+ (moment().month()+1) + '-' + todayDate
  + ' ' + adjustedTime + ':' + moment().minutes() + ':' + moment().seconds() + '.' + moment().milliseconds();
  return dateReturned;
}

let curDate = getCurrentDate();

var UserSchema = new mongoose.Schema({
  email: {type: String, minlength: 8, maxlength: 60}, //try to make unique, "unique :true" doesn't work
  username: {type: String, minlength: 5, maxlength: 20}, //try to make unique, "unique :true" doesn't work
  password: {type: String, minlength: 5, maxlength: 20},
  firstName: {type: String, minlength: 1, maxlength: 30},
  lastName: {type: String, minlength: 1, maxlength: 50},
  phone: {type: String, minlength: 10, maxlength: 20},
  birthday: {type: Date, min: "1900-01-01", max: "2019-12-31"},
  created: {type: Date, default: curDate},
  lastLogin: {type: Date, default: curDate},
  loginStreak: {type: Number, default: 1},
  coins: {type: Number, default: 100},
  highestWin: {type: Number, default: 0},
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
module.exports.getCurrentDate = getCurrentDate;