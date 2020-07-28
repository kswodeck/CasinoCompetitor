const          mongoose = require('mongoose'),
               helpers  = require('../helpers/helpers');

var PostSchema = new mongoose.Schema({ // schema for posts data
  username: {type: String, minlength: 5, maxlength: 25},
  created: {type: Date, default: helpers.getCurrentDate()},
  editted: {type: Date, default: null},
  coins: {type: Number},
  title: {type: String, minlength: 2, maxlength: 40},
  content: {type: String, minlength: 1, maxlength: 5000},
  category: {type: String, minlength: 2, maxlength: 50}
});

//Post.create({username: 'kswodeck', coins: 2530, title: 'Poker Tips!', content: 'Here are some poker tip', category: 'Poker'});

module.exports = mongoose.model("Post", PostSchema);