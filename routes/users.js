var express = require('express');
var passport = require('passport'),
    router   = express.Router({mergeParams: true}),
    moment   = require('moment'),
    User     = require('../models/user');

router.get('/cards', isLoggedIn, function(req, res){
  res.render('cards', {pageTitle: 'Competitive Poker', storedCoins: req.user.coins});
});
router.put('/cards', function(req, res){ //update coins
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

router.get('/leaderboard', isLoggedIn, function(req, res){
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) {
    if (err) {
      return console.log(err);
    } else {
      res.render('leaderboard', {pageTitle: 'Leaderboard', users: allUsers});
    }
  });
});

router.get('/register', isLoggedOut, function(req, res){
  res.render('register', {pageTitle: 'Create Account', error: false});
});
router.post('/register', function(req, res){
  let momentBirthday =  getLocalNoonDate(req.body.createUser.birthday);
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


router.get('/login', isLoggedOut, function(req, res){
  res.render('login', {pageTitle: 'Login'});
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}), function(req, res){ // try implementing error message on failed login
});
router.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  res.render('index', {pageTitle: 'Pocket Poker', fromLogout: true});
});

router.get('/account', isLoggedIn, function(req, res){
  if (req.user) {
  let formattedBirthday = formatDate(req.user.birthday);
  return res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, fromAccount: false});
  }
  return res.redirect('/login');
});
router.put('/account', function(req, res){
  const curUser = req.user, updated = req.body.updateUser;
  const formattedBirthday = formatDate(curUser.birthday);
  if (req.body.updatePassword) {
    curUser.changePassword(req.body.oldPassword, req.body.updatePassword, function(err, user) { // will use email instead
      if (err) {
        console.log(err);
      } else {
        console.log('Password changed to: ' + req.body.updatePassword);
        console.log(user);
      }
  });
} else {
  compareEachAccountInput(curUser, updated.firstName, curUser.firstName, 'firstName');
  compareEachAccountInput(curUser, updated.lastName, curUser.lastName, 'lastName');
  compareEachAccountInput(curUser, updated.email, curUser.email, 'email');
  compareEachAccountInput(curUser, updated.username, curUser.username, 'username');
  compareEachAccountInput(curUser, updated.phone, curUser.phone, 'phone');
  compareEachAccountInput(curUser, updated.birthday, formattedBirthday, 'birthday');
}
  return res.redirect('/account'); // implement 'Account has been updated' message
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
      let momentBirthday =  getLocalNoonDate(formValue);
      User.findOneAndUpdate({username: user.username}, {$set: {birthday: momentBirthday}}, {useFindAndModify: false, rawResult: true}, function(req, res){
      });
    }
    return console.log('Updated ' + valueName + ': ' + storedValue + ' to ' + formValue);
  } else {
    return console.log('values are equal');
  }
}

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

function getLocalNoonDate(date) {
  let adjustedTime = 12 + (moment().utcOffset()/60);
  let inputDate = date + ' ' + adjustedTime + ':00';
  return moment().format(inputDate);
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

module.exports = router;
