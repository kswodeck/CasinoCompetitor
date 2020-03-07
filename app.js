var express = require('express');
// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
// var hostname = '127.0.0.1';
// var port = 3000;
var hostname = 'localhost';
var port = 7700;

app.use(express.urlencoded({extended: true}));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var posts = [
  {title: 'Post 1', author: 'Kris'},
  {title: 'Post 2', author: 'Michael'},
  {title: 'Post 3', author: 'Swodeck'},
];

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use(express.static('public'));

app.get('/', function(req, res){
  // res.render('home');
  res.redirect('home.html');
})

app.get('/posts', function(req, res){
  res.render('posts', {posts: posts});
})

app.post('/addpost', function(req, res){
  // let newPost = req.body.newposttitle;
  // let newAuthor = req.body.newauthor;
  posts.push({title: req.body.newposttitle, author: req.body.newauthor});
  res.redirect('/posts');
});

app.listen(port, hostname, function(){
  console.log('App running on ' + hostname + ':' + port)
})

module.exports = app;
