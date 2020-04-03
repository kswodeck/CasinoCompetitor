var express      = require('express'),
  mongoose       = require('mongoose'),
  passport       = require('passport'),
  bodyParser     = require('body-parser'),
  LocalStrategy  = require('passport-local'),
  flash          = require('connect-flash'),
  app            = express(),
  methodOverride = require('method-override'),
  User           = require('./models/user'),
  userRoutes     = require('./routes/users'),
  featureRoutes  = require('./routes/features');
  
// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

const connectionString = 'mongodb+srv://kswodeck:Kmswo123!@pocketpoker1-zl3ub.mongodb.net/pocketpoker?retryWrites=true&w=majority';
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(flash());

app.use(require('express-session')({ // Passport configuration
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user; //set currentUser as a local variable
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.invalidUser = req.flash('invalidUser');
  res.locals.invalidEmail = req.flash('invalidEmail');
  res.locals.popup = req.flash('popup');
  next();
});

app.use('/', featureRoutes);
app.use('/', userRoutes);

app.use(function(req, res, next) {
  return res.status(404).render('error', {pageTitle: 'Page Not Found', message: 'Route '+req.url+' does not exist', status: 'Page Not Found: 404'});
});
app.use(function(err, req, res, next) {
  return res.status(500).render('error', {pageTitle: 'Server Error', message: err, status: 'Server Error: 500'});
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
//
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

var server = app.listen(port, hostname, function(){
  console.log('App running on ' + hostname + ':' + port)
});

module.exports = app;
