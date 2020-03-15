var express = require('express'),
        app = express(),
 bodyParser = require('body-parser'),
   mongoose = require('mongoose');

// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var hostname = '127.0.0.1';
var port = process.env.PORT || 3000;
// var hostname = 'localhost';
// var port = 7700;

// mongoose.connect("mongodb://localhost/");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// app.set('views', path.join(__dirname, 'views'));

var userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  phone: String,
  birthday: Date,
  coins: Number,
  registerDate: Date,
  firstLogin: Date,
  lastLogin: Date,
  loginStreak: Number
});

var User = mongoose.model("User", userSchema);

// function getCurrentDate() {
//   let today = new Date();
//   let currentMonth = today.getMonth()+1;
//   if (currentMonth < 10) {
//     currentMonth = '0' + currentMonth;
//   }
//   let currentDate = today.getDate();
//   if (currentDate < 10) {
// 	  currentDate = '0' + currentDate;
//   }
//   return currentMonth + '/'+ currentDate + '/' + today.getFullYear();
// }

// User.create({
//   email: "kswodeck@yahoo.com",
//   username: "kswodeck",
//   password: "KrisUser",
//   firstName: "Kristoffer",
//   lastName: "Swodeck",
//   phone: "1234567890",
//   birthday: "09/29/1995",
//   coins: 100,
//   registerDate: "03/14/2020",
//   firstLogin: "03/14/2020",
//   lastLogin: getCurrentDate(),
//   loginStreak: 1
// }, function(err, user) {
//    if (err) {
//      console.log(err);
//   } else {
//      console.log('Created User: ');
//      console.log(user);
// }
// });

// var posts = [
//   {title: 'Post 1', author: 'Kris'},
//   {title: 'Post 2', author: 'Michael'},
//   {title: 'Post 3', author: 'Swodeck'},
// ];

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
  res.render('home');
  // res.redirect('home.html');
});

app.post('/register', function(req, res){
  // res.render('home');
  res.redirect('home.html');
});

app.get('/posts', function(req, res){
  res.render('posts', {posts: posts});
});

app.post('/addpost', function(req, res){
  // let newPost = req.body.newposttitle;
  // let newAuthor = req.body.newauthor;
  posts.push({title: req.body.newposttitle, author: req.body.newauthor});
  res.redirect('/posts');
});

app.listen(port, hostname, function(){
  console.log('App running on ' + hostname + ':' + port)
});

// app.listen(port, function () {
//   console.log("Server Has Started on PORT: " + port);
// });

module.exports = app;
