const { format } = require('path');

const express  = require('express'),
      passport = require('passport'),
      router   = express.Router({mergeParams: true}),
      moment   = require('moment'),
      User     = require('../models/user'),
      Blog     = require('../models/blog'),
      badWords = require('../helpers/words'),
      helpers  = require('../helpers/helpers');

// Blog.create({userId: '5edd99e1de86290004f56157', username: 'tatums96', title: 'Poker Tips! 4', body: 'Here are poker tips from tatums96', board: 'Poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', username: 'kswodeck', title: 'Poker Tips! 1', body: 'Here are poker tips from kswodeck', board: 'Poker'});
// Blog.create({userId: '5edd99e1de86290004f56157', username: 'tatums96', title: 'Poker Tips! 2', body: 'Here are more poker tips from tatums96', board: 'Poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', username: 'kswodeck', title: 'Poker Tips! 3', body: 'Here are more poker tips from kswodeck', board: 'Poker'});

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
  let postDeleted = false;
  if (req.query.deleted && req.user) {
    postDeleted = req.query.deleted;
  }
  Blog.find({board: req.params.board}).sort({editted: 1, created: 1}).exec(function(err, posts) {
    if (err || !posts) {
      console.log(err);
    }
    let created = [], editted = []
    for (let i = 0; i < posts.length; i++) {
      created.push(helpers.formatDate(posts[i].created));
      editted.push(helpers.formatDate(posts[i].editted));
    }
    res.render('board', {pageTitle: req.params.board, posts: posts, deleted: postDeleted, editted: editted, created: created});
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
        let created = helpers.formatDate(post.created);
        let editted = helpers.formatDate(post.editted);
        res.render('post', {pageTitle: post.title, board: req.params.board, post: post, user: user, sameUser: sameUser, created: created, editted: editted});
      });
    }
  });
});

router.put('/blog/:board/:id', helpers.isLoggedIn, (req, res) => {
  let current = new Date(helpers.getCurrentDate());
  Blog.findByIdAndUpdate(req.params.id, {editted: current, body: req.body.postBody}, {useFindAndModify: false}, (err, post) => {
    if (err || !post) {
      console.log(err);
    } else {
      req.flash('updateSuccess', 'Your post has been updated');
      res.redirect('/blog/' + req.params.board + '/' + req.params.id);
    }
  });
});

router.delete('/blog/:board/:id', helpers.isLoggedIn, (req, res) => {
  Blog.findByIdAndDelete(req.params.id, (err, post) => {
    if (err || !post) {
      req.flash('error', err);
      res.redirect('/blog/' + req.params.board);
    } else {
      req.flash('deleteSuccess', 'Your post has been deleted');
      res.redirect('/blog/' + req.params.board + '?deleted=true');
    }
  });
});

module.exports = router;