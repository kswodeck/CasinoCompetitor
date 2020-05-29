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

const connectionString = 'mongodb+srv://kswodeck:Kmswo123!@pocketpoker1-zl3ub.mongodb.net/pocketpoker?retryWrites=true&w=majority';
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

app.use((req, res, next) => {
  res.locals.currentUser = req.user; //set currentUser as a local variable
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.invalidUser = req.flash('invalidUser');
  res.locals.invalidEmail = req.flash('invalidEmail');
  res.locals.popup = req.flash('popup');
  res.locals.invalidPW = req.flash('invalidPW');
  next();
});

app.use('/', featureRoutes);
app.use('/', userRoutes);

app.use((req, res) => {
  return res.status(404).render('error', {pageTitle: 'Page Not Found', message: 'Route '+req.url+' does not exist', status: 'Page Not Found: 404'});
});
app.use((err, res) => {
  return res.status(500).render('error', {pageTitle: 'Server Error', message: err, status: 'Server Error: 500'});
});

app.listen(port, hostname, () =>{
  console.log('App running on ' + hostname + ':' + port)
});

module.exports = app;
