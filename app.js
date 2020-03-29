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

app.use(require('express-session')({ // Passport configuration
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
  res.render('index', {pageTitle: 'Pocket Poker', fromLogout: false});
});

app.get('/cards', isLoggedIn, function(req, res){
  res.render('cards', {pageTitle: 'Competitive Poker', storedCoins: req.user.coins});
});
app.put('/cards', function(req, res){ //update coins
  var isRedirect = req.body.redirect;
  if (isRedirect == 'true') {
    return res.redirect('/cards');
  } else {
  console.log('updating coins: ' + req.user.coins + ' to ' + req.body.userCoins);
  User.findOneAndUpdate({username: req.user.username}, {$set: {coins: req.body.userCoins}}, {useFindAndModify: false, rawResult: true}, function(req, res){
  });
  return;
  }
});
app.get('/practice-cards', function(req, res){
  res.render('practice-cards', {pageTitle: 'Practice Poker'});
});
app.get('/leaderboard', isLoggedIn, function(req, res){
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) {
    if (err) {
      return console.log(err);
    } else {
      // module.exports.users = allUsers;
      res.render('leaderboard', {pageTitle: 'Leaderboard', users: allUsers});
    }
  });
});

app.get('/register', isLoggedOut, function(req, res){
  res.render('register', {pageTitle: 'Create Account', error: false});
});
app.post('/register', function(req, res){
  let adjustedTime = 12 + (moment().utcOffset()/60);
  let inputBirthday = req.body.createUser.birthday + ' ' + adjustedTime + ':00';
  let momentBirthday = moment().format(inputBirthday);
  var newUser = new User({email: req.body.createUser.email, username: req.body.username, firstName: req.body.createUser.firstName, lastName: req.body.createUser.lastName, phone: req.body.createUser.phone, birthday: momentBirthday});
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
  res.render('login', {pageTitle: 'Login'});
});
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
  // try implementing error message on failed login
}), function(req, res){
});
app.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  res.render('index', {pageTitle: 'Pocket Poker', fromLogout: true});
});

app.get('/account', isLoggedIn, function(req, res){
  if (req.user) {
  let formattedBirthday = formatDate(req.user.birthday);
  return res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, fromAccount: false});
  }
  return res.redirect('/login');
});
app.put('/account', function(req, res){
  const curUser = req.user;
  const updated = req.body.updateUser;
  const formattedBirthday = formatDate(curUser.birthday);
  if (req.body.updatePassword) {
    curUser.setPassword(req.body.updatePassword, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log('Password: ' + req.body.oldPassword + ' changed to ' + req.body.updatePassword); // will use email instead
      }
  });
} else {
  compareEachAccountInput(curUser, updated.firstName, curUser.firstName, 'firstName');
  compareEachAccountInput(curUser, updated.lastName, curUser.lastName, 'lastName');
  compareEachAccountInput(curUser, updated.email, curUser.email, 'email');
  compareEachAccountInput(curUser, updated.username, curUser.username, 'username');
  compareEachAccountInput(curUser, updated.phone, curUser.phone, 'phone');
  compareEachAccountInput(curUser, updated.birthday, formattedBirthday, 'birthday');
  // try implementing 'Account has been updated' message
}
  return res.redirect('/account');
});
function compareEachAccountInput(user, formValue, storedValue, valueName){
  if (formValue != storedValue) {
    if (valueName == 'firstName') {
      User.findOneAndUpdate({username: user.username}, {$set: {firstName: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){
      });
    } else if (valueName == 'lastName') {
      User.findOneAndUpdate({username: user.username}, {$set: {lastName: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){
      });
    } else if (valueName == 'email') {
      User.findOneAndUpdate({username: user.username}, {$set: {email: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){
      });
    } else if (valueName == 'username') {
      User.findOneAndUpdate({username: user.username}, {$set: {username: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){
      });
    } else if (valueName == 'phone') {
      User.findOneAndUpdate({username: user.username}, {$set: {phone: formValue}}, {useFindAndModify: false, rawResult: true}, function(req, res){
      });
    } else if (valueName == 'birthday') {
      let inputBirthday = formValue + ' ' + '12:00';
      let momentBirthday = moment().format(inputBirthday);
      User.findOneAndUpdate({username: user.username}, {$set: {birthday: momentBirthday}}, {useFindAndModify: false, rawResult: true}, function(req, res){
      });
    }
    return console.log('Updated ' + valueName + ': ' + storedValue + ' to ' + formValue);
  } else {
    return console.log('values are equal');
  }
}

app.get('/dice', function(req, res){
  res.render('dice', {pageTitle: 'Dice'});
});
app.get('/coin', function(req, res){
  res.render('coin', {pageTitle: 'Coin'});
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/login');
}
function isLoggedOut(req, res, next){
  if(!req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}

function formatDate(date) {
  let unformattedDate = date.toString();
  let formattedYear = unformattedDate.slice(11, 15);
  let formattedMonth = unformattedDate.slice(4, 7);
  formattedMonth = getMonthNum(formattedMonth);
  let formattedDay = unformattedDate.slice(8, 10);
  let formattedDate = formattedYear + '-' + formattedMonth + '-' + formattedDay;
  return formattedDate;
}

function getMonthNum(month) {
  month === 'Jan' ? month = '01' : month === 'Feb' ? month = '02' : month === 'Mar' ? month = '03' : month === 'Apr' ? month = '04' :
  month === 'May' ? month = '05' : month === 'Jun' ? month = '06' : month === 'Jul' ? month = '07' :  month === 'Aug' ? month = '08' :
  month === 'Sep' ? month = '09' : month === 'Oct' ? month = '10' : month === 'Nov' ? month = '11' : month = '12';
  return month;
}

var server = app.listen(port, hostname, function(){
  console.log('App running on ' + hostname + ':' + port)
});

module.exports = app;
