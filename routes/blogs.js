const express  = require('express'),
      router   = express.Router({mergeParams: true}),
      moment   = require('moment'),
      Blog     = require('../models/blog'),
      badWords = require('../helpers/words'),
      helpers  = require('../helpers/helpers');

//Blog.create({userId: , title: 'Poker Tips!', content: 'Here are some poker tips', board: 'poker'});
//restful routes
// Index = /blog. GET (blog.ejs template)
// Board = /blog/:board. GET (board.ejs template)
// New = /blog/:board/new. GET (consider making this a dialog popup instead of a route)
// Create = /blog. POST (take to /blog/:board/:id after created) 
// Show = /blog/:board/:id. GET (post.ejs template)
// Edit = /blog/:board/:id/edit. GET (consider making this a dialog popup instead of a route)
// Update = /blog/:board/:id. PUT (take to /blog/:board/:id after updated)
// Delete = /blog/:board/:id. DELETE (take to /blog/:board after updated) (confirmation message displays)

// blog related routes
router.get('/blog', (req, res) => {
  res.render('blog', {pageTitle: 'Community Blog'});
});

router.get('/blog/:board', (req, res) => {
  res.render('board', {pageTitle: req.params.board});
});

module.exports = router;