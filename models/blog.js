const          mongoose = require('mongoose'),
               helpers  = require('../public/javascripts/helpers');

var BlogSchema = new mongoose.Schema({ // schema for blogs data
  userId: {type: String, minlength: 24, maxlength: 24},
  username: {type: String, minlength: 5, maxlength: 25},
  title: {type: String, minlength: 2, maxlength: 40},
  body: {type: String, minlength: 2, maxlength: 50000},
  board: {type: String, minlength: 2, maxlength: 50},
  created: {type: Date, default: helpers.getCurrentDate()},
  editted: {type: Date, default: helpers.getCurrentDate()},
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

//figure out how to connect replys under the post

module.exports = mongoose.model("Blog", BlogSchema);