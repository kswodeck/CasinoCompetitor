const          mongoose = require('mongoose'),
               helpers  = require('../public/javascripts/helpers');

var CommentSchema = new mongoose.Schema({ // schema for comments data
  // userId: {type: String, minlength: 24, maxlength: 24}, //may not need this
  username: {type: String, minlength: 5, maxlength: 25},
  body: {type: String, minlength: 2, maxlength: 30000},
  created: {type: Date, default: helpers.getCurrentDate()},
  editted: {type: Date, default: helpers.getCurrentDate()}
});

module.exports = mongoose.model("Comment", CommentSchema);