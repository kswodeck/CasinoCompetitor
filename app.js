var express             = require('express'),
  mongoose              = require('mongoose'),
  passport              = require('passport'),
  bodyParser            = require('body-parser'),
  LocalStrategy         = require('passport-local'),
  moment                = require('moment'),
  methodOverride        = require('method-override'),
  User                  = require('./models/user');

// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const connectionString = 'mongodb+srv://kswodeck:Kmswo123!@pocketpoker1-zl3ub.mongodb.net/pocketpoker?retryWrites=true&w=majority';
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Passport configuration
app.use(require('express-session')({
  secret: 'This is a secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// async function createUser(username) {
//   return new User({
//     username,
//     created: Date.now()
//   }).save()
// }

// async function findUser(username) {
//   return await User.findOne({ username })
// }

// ;(async () => {
//   const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
//   const username = process.argv[2].split('=')[1];

//   let user = await connector.then(async () => {
//     return findUser(username);
//   })

//   if (!user) {
//     user = await createUser(username);
//   }

//   console.log(user);
//   process.exit(0);
// })();

// app.set('views', path.join(__dirname, 'views'));

// let currentCoins = 0;
// for (let i=0; i<101; i++) {
// User.create({
//   email: "kswodeck@yahoo.com",
//   username: "kswodeck",
//   password: "KrisUser",
//   firstName: "Kristoffer",
//   lastName: "Swodeck",
//   phone: "1234567890",
//   birthday: "09/29/1995",
//   coins: currentCoins
// }, function(err, user) {
//    if (err) {
//      console.log(err);
//   } else {
//      console.log('Created User: ');
//      console.log(user);
// }
// });
// currentCoins++;
// }

// User.create({
//   email: "kmswodeck@gmail.com",
//   username: "kswodeck",
//   password: "KrisUser",
//   firstName: "Kristoffer",
//   lastName: "Swodeck",
//   phone: "1234567890",
//   birthday: "09/29/1995"
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

// * APP ROUTES *
app.get('/', function(req, res){
  let loggedUser = '';
  if (req.isAuthenticated() === true) {
    loggedUser = req.user.username;
  }
  res.render('index', {pageTitle: 'Pocket Poker', isLoggedIn: req.isAuthenticated(), fromLogout: false, welcomeUser: loggedUser});
});

app.get('/cards', isLoggedIn, function(req, res){
  res.render('cards', {pageTitle: 'Competitive Poker', isLoggedIn: true});
});
app.get('/practice-cards', function(req, res){
  res.render('practice-cards', {pageTitle: 'Practice Poker', isLoggedIn: req.isAuthenticated()});
});
app.get('/leaderboard', isLoggedIn, function(req, res){
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) {
    if (err) {
      return console.log(err);
    } else {
      // module.exports.users = allUsers;
      res.render('leaderboard', {pageTitle: 'Leaderboard', users: allUsers, isLoggedIn: true});
    }
  });
});

app.get('/register', isLoggedOut, function(req, res){
  res.render('register', {pageTitle: 'Create Account', isLoggedIn: false, error: false});
});
app.post('/register', function(req, res){
  var newUser = new User({email: req.body.createUser.email, username: req.body.username, firstName: req.body.createUser.firstName, lastName: req.body.createUser.lastName, phone: req.body.createUser.phone, birthday: req.body.createUser.birthday});
  // try refactor to req.body.createUser, no curly braces
  // var newUser = new User({username: req.body.username}, req.body.createUser);
  User.register(newUser, req.body.password, function(err, user){
      if(err){
        console.log("Error: " + err);
        return res.render('register', {pageTitle: 'Create Account', isLoggedIn: false, error: true, message: err.message});
      }
      console.log(user);
      passport.authenticate('local')(req, res, function(){
        res.redirect('/');
      });
  });
});

app.get('/login', isLoggedOut, function(req, res){
  res.render('login', {pageTitle: 'Login', isLoggedIn: false});
});
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}), function(req, res){
});
app.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  res.render('index', {pageTitle: 'Pocket Poker', isLoggedIn: false, fromLogout: true});
});

app.get('/account', isLoggedIn, function(req, res){
  console.log('Logged in User: ' + req.user);
  if (req.isAuthenticated() === true) {
  let formattedBirthday = formatDate(req.user.birthday);
  //continue work on formatting dates (use moment.js). Try to have birthday submit at hour of 12
  return res.render('account', {pageTitle: 'My Account', isLoggedIn: true, loggedUser: req.user, birthday: formattedBirthday});
  }
  return res.redirect('/login');
});
app.put('/account', function(req, res){
  res.redirect('/account');
});

app.get('/dice', function(req, res){
  res.render('dice', {pageTitle: 'Dice', isLoggedIn: req.isAuthenticated()});
});
app.get('/coin', function(req, res){
  res.render('coin', {pageTitle: 'Coin', isLoggedIn: req.isAuthenticated()});
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/login');
}
function isLoggedOut(req, res, next){
  if(req.isAuthenticated()===false){
      return next();
  }
  res.redirect('/');
}

function formatDate(date) {
  console.log('Date before string: ' + date);
  let unformattedDate = date.toString();
  console.log('value of unformmatted birthday: ' + unformattedDate);
  let formattedYear = unformattedDate.slice(11, 15);
  console.log('Year: '+ formattedYear);
  let formattedMonth = unformattedDate.slice(4, 7);
  console.log('Month: '+ formattedMonth);
  let formattedDay = unformattedDate.slice(8, 10);
  console.log('Day: '+ formattedDay);
  let formattedDate = formattedMonth + '/' + formattedDay + '/' + formattedYear;
  console.log('Formatted Date: '+ formattedDate);
  return formattedDate;
}

var server = app.listen(port, hostname, function(){
  console.log('App running on ' + hostname + ':' + port)
});

module.exports = app;
