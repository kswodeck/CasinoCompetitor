const express  = require('express'),
      passport = require('passport'),
      router   = express.Router({mergeParams: true}),
      moment   = require('moment'),
      User     = require('../models/user'),
      Blog     = require('../models/blog'),
      badWords = require('../helpers/words'),
      helpers  = require('../helpers/helpers');

// Blog.create({userId: '5edd99e1de86290004f56157', title: 'Poker Tips!', body: 'Here are poker tips from kswodeck', board: 'poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', title: 'Poker Tips!', body: 'Here are poker tips from tatums', board: 'poker'});
// Blog.create({userId: '5edd99e1de86290004f56157', title: 'Poker Tips!', body: 'Here are more poker tips from kswodeck', board: 'poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', title: 'Poker Tips!', body: 'Here are more poker tips from tatums', board: 'poker'});

// Blog.create({userId: , title: 'Poker Tips!', body: 'Here are some poker tips', board: 'poker'});
//restful routes
// Index = /blog. GET (blog.ejs template)
// Board = /blog/:board. GET (board.ejs template)
// New = /blog/:board/new. GET (consider making this a dialog popup instead of a route)
// Create = /blog. POST (take to /blog/:board/:id after created) 
// Show = /blog/:board/:id. GET (post.ejs template)
// Edit = /blog/:board/:id/edit. GET (consider making this a dialog popup instead of a route)
// Update = /blog/:board/:id. PUT (take to /blog/:board/:id after updated)
// Delete = /blog/:board/:id. DELETE (take to /blog/:board after updated) (confirmation message displays after clicking "X"/delete button)

// blog related routes
router.get('/blog', (req, res) => {
  res.render('blog', {pageTitle: 'Community Blog'});
});

router.get('/blog/:board', (req, res) => {
  Blog.find({board: req.params.board}).sort({editted: 1, created: 1}).exec(function(err, posts) {
    if (err || !posts) {
      console.log(err);
    }
    res.render('board', {pageTitle: req.params.board, posts: posts});
  });
});

router.get('/blog/:board/:id', (req, res) => {
  Blog.findById(req.params.id, (err, post) => {
    if (err || !post) {
      console.log(err);
      res.render('blog', {pageTitle: 'Community Blog'});
    } else {
      User.findById(post.userId, (err, user) => {
        if (err || !user) {
          console.log(err);
        }
        let sameUser = false;
        if (req.user && req.user._id.toString() == user._id.toString()) {
          sameUser = true;
        }
        res.render('post', {pageTitle: post.title, board: req.params.board, post: post, user: user, sameUser: sameUser});
      });
    }
  });
});

module.exports = router;