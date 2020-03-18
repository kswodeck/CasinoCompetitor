var mongoose = require('mongoose');

let curDate = getCurrentDate();

function getCurrentDate() {
  let today = new Date();
  let dateReturned = (today.getMonth()+1) + '/'+ today.getDate() + '/' + today.getFullYear();
  return dateReturned;
}

var userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  phone: String,
  birthday: Date,
  created: {type: Date, default: curDate},
  lastLogin: {type: Date, default: curDate},
  loginStreak: {type: Number, default: 1},
  coins: {type: Number, default: 100},
  highestWin: {type: Number, default: 0},
});

module.exports = mongoose.model("User", userSchema);