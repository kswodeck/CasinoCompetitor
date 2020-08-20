const express  = require('express'),
      passport = require('passport'),
      router   = express.Router({mergeParams: true}),
      moment   = require('moment'),
      User     = require('../models/user'),
      Blog     = require('../models/blog'),
      Comment  = require('../models/comment'),
      helpers  = require('../public/javascripts/helpers');

// Blog.create({userId: '5edd99e1de86290004f56157', username: 'tatums96', title: 'Poker Tips! 4', body: 'Here are poker tips from tatums96', board: 'Poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', username: 'kswodeck', title: 'Poker Tips! 1', body: 'Here are poker tips from kswodeck', board: 'Poker'});
// Blog.create({userId: '5edd99e1de86290004f56157', username: 'tatums96', title: 'Poker Tips! 2', body: 'Here are more poker tips from tatums96', board: 'Poker'});
// Blog.create({userId: '5eddac7fc8e4e800042c089e', username: 'kswodeck', title: 'Poker Tips! 3', body: 'Here are more poker tips from kswodeck', board: 'Poker'});

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
  Blog.create({userId: req.user._id, username: req.user.username, title: req.body.newPostTitle, body: req.body.newPostText, board: req.params.board}, (err, post) => {
    if (err || !post){
      console.log('error:', err);
      res.redirect('/blog/' + req.params.board);
    } else {
      req.flash('success', 'Your post has been created');
      res.redirect('/blog/' + req.params.board + '/' + post._id);
    }
  });
});

router.get('/blog/:board/new', (req, res) => {
  res.render('newpost', {pageTitle: 'Create New Post', board: req.params.board});
});

router.get('/blog/:board/:id', (req, res) => { //make sure this works
  Blog.findById(req.params.id).populate('comments').exec((err, post) => {
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
  Blog.findByIdAndUpdate(req.params.id, {editted: current, title: req.body.postTitle, body: req.body.postTextArea}, {useFindAndModify: false}, (err, post) => {
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

router.post('/blog/:board/:id', (req, res) => { //make sure this works for creating commentts
  Blog.findById(req.params.id, (err, post) => {
    if (err || !post) {
      console.log(err);
      res.redirect('/blog/' + req.params.board);
    } else {
      Comment.create({username: post.username, body: req.body.addCommentTextArea}, (err, comment) => {
        if (err || !comment) {
          console.log(err);
        } else {
          post.comments.push(comment);
          post.save();
          res.redirect('/blog/' + post.board + '/' + post._id);
        }
      });
    }
  });
});

router.put('/blog/:board/:id/:comment', (req, res) => { //update blog and specific comments linked. find way to access comments in array
  let current = new Date(helpers.getCurrentDate());
  let text = req.body.commentTextArea;
  Blog.findById(req.params.id, (err, post) => { 
    if (err || !post) {
      res.redirect('/blog/' + post.board + '/' + post._id);
    } else {
      Comment.findByIdAndUpdate(post.comments[req.params.comment]._id, {body: text, editted: current}, {useFindAndModify: false}, (error, updated) => {
        if (error || !updated) {
          res.redirect('/blog/' + post.board + '/' + post._id);
        } else {
          console.log(updated);
          req.flash('updateComment', 'Your comment has been updated');
          res.redirect('/blog/' + post.board + '/' + post._id);
        }
      });
    }
  });
});

router.delete('/blog/:board/:id/:comment', helpers.isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, post) => { 
    if (err || !post) {
      res.redirect('/blog/' + post.board + '/' + post._id);
    } else {
      Comment.findByIdAndDelete(post.comments[req.params.comment]._id, (error, deleted) => {
        if (error || !deleted) {
          res.redirect('/blog/' + post.board + '/' + post._id);
        } else {
          post.comments.splice(req.params.comment, 1); //this not deleting
          post.save();
          req.flash('deleteComment', 'Your comment has been deleted');
          res.redirect('/blog/' + post.board + '/' + post._id);
        }
      });
    }
  });
});

module.exports = router;