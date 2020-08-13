const express  = require('express'),
      passport = require('passport'),
      router   = express.Router({mergeParams: true}),
      moment   = require('moment'),
      User     = require('../models/user'),
      Blog     = require('../models/blog'),
      helpers  = require('../helpers/helpers');

// Blog.create({userId: '5edd99e1de86290004f56157', username: 'tatums96', title: 'Poker Tips! 4', body: 'Here are poker tips from tatums96', board: 'Poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', username: 'kswodeck', title: 'Poker Tips! 1', body: 'Here are poker tips from kswodeck', board: 'Poker'});
// Blog.create({userId: '5edd99e1de86290004f56157', username: 'tatums96', title: 'Poker Tips! 2', body: 'Here are more poker tips from tatums96', board: 'Poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', username: 'kswodeck', title: 'Poker Tips! 3', body: 'Here are more poker tips from kswodeck', board: 'Poker'});

// Index = /blog. GET (blog.ejs template) DONE
// Board = /blog/:board. GET (board.ejs template) DONE
// New = /blog/:board/new. GET (consider making this a dialog popup instead of a route)
// Create = /blog. POST (take to /blog/:board/:id after created) 
// Show = /blog/:board/:id. GET (post.ejs template) DONE
// Update = /blog/:board/:id. PUT (take to /blog/:board/:id after updated) DONE
// Delete = /blog/:board/:id. DELETE (take to /blog/:board after deleted) DONE

// blog related routes
router.get('/blog', (req, res) => {
  res.render('blog', {pageTitle: 'Community Blog'});
});

router.get('/blog/:board', (req, res) => {
  let postDeleted = false;
  if (req.query.deleted && req.user) {
    postDeleted = req.query.deleted;
  }
  Blog.find({board: req.params.board}).sort({editted: 'desc', created: 'desc'}).exec(function(err, posts) {
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
router.post('/blog/:board', helpers.isLoggedIn, (req, res) => {
  if (helpers.containsBadWord(req.body.newPostText.toString().toLowerCase())) {
    req.flash('badText', 'You must not have a bad word in your post');
    res.redirect('/blog/' + req.params.board + '/new');
  } else if (helpers.containsBadWord(req.body.newPostTitle.toString().toLowerCase())) {
    req.flash('badTitle', 'You must not have a bad word in your title');
    res.redirect('/blog/' + req.params.board + '/new');
  } else {
    Blog.create({userId: req.user._id, username: req.user.username, title: req.body.newPostTitle, body: req.body.newPostText, board: req.params.board}, (err, post) => {
      if (err || !post){
        console.log('error:', err);
        res.redirect('/blog/' + req.params.board);
      } else {
        req.flash('success', 'Your post has been created');
        res.redirect('/blog/' + req.params.board + '/' + post._id);
      }
    });
  }
});

router.get('/blog/:board/new', (req, res) => {
  res.render('newpost', {pageTitle: 'Create New Post', board: req.params.board});
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
  if (helpers.containsBadWord(req.body.postTitle.toString().toLowerCase())) {
    req.flash('badTitle', 'You must not have a bad word in your title');
    res.redirect('/blog/' + req.params.board + '/' + req.params.id);
  } else if (helpers.containsBadWord(req.body.postTextArea.toString().toLowerCase())) {
    req.flash('badText', 'You must not have a bad word in your post');
    res.redirect('/blog/' + req.params.board + '/' + req.params.id);
  } else {
    let current = new Date(helpers.getCurrentDate());
    Blog.findByIdAndUpdate(req.params.id, {editted: current, title: req.body.postTitle, body: req.body.postTextArea}, {useFindAndModify: false}, (err, post) => {
      if (err || !post) {
        console.log(err);
      } else {
      req.flash('updateSuccess', 'Your post has been updated');
      res.redirect('/blog/' + req.params.board + '/' + req.params.id);
      }
    });
  }
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