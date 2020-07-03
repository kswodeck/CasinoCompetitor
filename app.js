const express      = require('express'),
  mongoose       = require('mongoose'),
  passport       = require('passport'),
  bodyParser     = require('body-parser'),
  LocalStrategy  = require('passport-local'),
  flash          = require('connect-flash'),
  app            = express(),
  methodOverride = require('method-override'),
  User           = require('./models/user'),
  userRoutes     = require('./routes/users'),
  featureRoutes  = require('./routes/features'),
  fs             = require('fs'),
  https          = require('https'),
  http           = require('http'),
  Sentry         = require('@sentry/node');
                   require('dotenv').config();

Sentry.init({dsn:'https://bc7444c26cad4159a4fc1818045022ba@o404801.ingest.sentry.io/5269442'});

const hostname = process.env.HOSTNAME || '0.0.0.0';
// const httpPort = process.env.HTTPPORT || 80;
// const httpsPort = process.env.HTTPSPORT || 443;
const port = process.env.PORT || 5000;
const dbURL = process.env.DATABASEURL;
// const cert = fs.readFileSync('ssl/casinocompetitor_com.crt');
// const ca = fs.readFileSync('ssl/casinocompetitor_com.ca-bundle');
// const key = fs.readFileSync('ssl/casinocompetitor.key');

// const httpsServer = https.createServer({cert, ca, key}, app);
// const httpServer = http.createServer(app);

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/javascripts', express.static(__dirname + '/node_modules/'));
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
  res.locals.currentUser = req.user; //set local variables
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.invalidUser = req.flash('invalidUser');
  res.locals.invalidEmail = req.flash('invalidEmail');
  res.locals.popup = req.flash('popup');
  res.locals.invalidPW = req.flash('invalidPW');
  // if(req.protocol === 'http') {
  //   res.redirect(301, 'https://' + req.headers.host);
  //   // res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
  //   // res.end();
  // }
  next();
});

app.use('/', featureRoutes);
app.use('/', userRoutes);

app.use((req, res) => {
  return res.status(404).render('error', {pageTitle: 'Page Not Found', message: 'Route '+ req.url +' does not exist', status: 'Page Not Found: 404'});
});
app.use((err, res) => {
  return res.status(500).render('error', {pageTitle: 'Server Error', message: err, status: 'Server Error: 500'});
});

// httpServer.listen(httpPort, hostname);
// httpsServer.listen(httpsPort, hostname);
app.listen(port, hostname);
// console.log('http running on ' + hostname + ':' + httpPort);
// console.log('https running on ' + hostname + ':' + httpsPort);

module.exports = app;