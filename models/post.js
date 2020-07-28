var          mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose'),
       getCurrentDate = require('../routes/users').getCurrentDate;

let curDate = getCurrentDate();

var PostSchema = new mongoose.Schema({ // schema for posts data
  username: {type: String, minlength: 5, maxlength: 25},
  firstName: {type: String, minlength: 1, maxlength: 40},
  lastName: {type: String, minlength: 1, maxlength: 50},
  created: {type: Date, default: curDate},
  editted: {type: Date, default: curDate},
  coins: {type: Number},
  highestWin: {type: Number},
});

PostSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Post", PostSchema);