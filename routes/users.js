var express = require('express');
var passport = require('passport'),
    router   = express.Router({mergeParams: true}),
    moment   = require('moment'),
    User     = require('../models/user');

router.get('/cards', isLoggedIn, function(req, res){
  res.render('cards', {pageTitle: 'Competitive Poker', storedCoins: req.user.coins});
});
router.put('/cards', isLoggedIn, function(req, res){
  if (req.body.userCoins != req.user.coins) { //update coins
    console.log('updating coins: ' + req.user.coins + ' to ' + req.body.userCoins);
    User.findOneAndUpdate({username: req.user.username}, {$set: {coins: req.body.userCoins}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
  }
  if (req.body.currentWin > req.user.highestWin) { //update highestWin
    console.log('updating highestWin: ' + req.user.highestWin + ' to ' + req.body.currentWin);
    User.findOneAndUpdate({username: req.user.username}, {$set: {highestWin: req.body.currentWin}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
  }
  return res.status(204).send(); //this works in ending the request
});

router.get('/leaderboard', isLoggedIn, function(req, res){
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) {
    if (err) {
      console.log(err);
    } else {
      return res.render('leaderboard', {pageTitle: 'Leaderboard', users: allUsers});
    }
  });
});

router.get('/register', isLoggedOut, function(req, res){
  res.render('register', {pageTitle: 'Create Account'});
});
router.post('/register', isLoggedOut, function(req, res){
  User.find({email: req.body.createUser.email}, function(err, emails){
    if (err || emails.length > 0) { // need to display UI errors without refreshing page (need user's editted values to stay)
      req.flash('error', 'The email provided is already registered');
      res.redirect('/register');
    } else {
      User.find({username: req.body.username}, function(err, usernames) {
        if (err || usernames.length > 0) {
          req.flash('error', 'The username provided is already registered');
          res.redirect('/register');
        } else {
          let momentBirthday = getLocalNoonDate(req.body.createUser.birthday);
          var newUser = new User({email: req.body.createUser.email, username: req.body.username, firstName: req.body.createUser.firstName, lastName: req.body.createUser.lastName, phone: req.body.createUser.phone, birthday: momentBirthday});
          User.register(newUser, req.body.password, function(err, user){
              if (err){
                req.flash('error', err);
                res.redirect('/register');
              } else {
                console.log(user);
                passport.authenticate('local')(req, res, function(){
                res.redirect('/');
              });
            }
          });
        }
      });
    }
  });
});

router.get('/login', isLoggedOut, function(req, res){
  res.render('login', {pageTitle: 'Login'});
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Incorrect username or password'
}), function(req, res){
});
router.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  req.flash('popup', true);
  res.redirect('/');
});

router.get('/account', isLoggedIn, function(req, res){
  if (req.user) {
  let formattedBirthday = formatDate(req.user.birthday);
  return res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, error: false});
  }
  res.redirect('/login');
});
router.put('/account', function(req, res){
  var curUser = req.user, updated = req.body.updateUser;
  if (req.body.updatePassword) {
      curUser.changePassword(req.body.oldPassword, req.body.updatePassword, function(err, user) { // will use email instead
        if (err){
          console.log(err);
          return res.status(204).send();
        } else {
          console.log('Password changed to: ' + req.body.updatePassword);
          req.flash('success', 'Account has been updated');
          res.redirect('/account');
        }
      });
  } else { //figure out how to handle errors here.. may need chains of if elses so that only one redirect/flash is done
    var formattedBirthday = formatDate(curUser.birthday);
    if (updated.firstName != curUser.firstName) {
      User.findOneAndUpdate({username: curUser.username}, {$set: {firstName: updated.firstName}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('firstName updated from: ' + curUser.firstName + ' to ' + updated.firstName);
    } 
    if (updated.lastName != curUser.lastName) {
      User.findOneAndUpdate({username: curUser.username}, {$set: {lastName: updated.lastName}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('lastName updated from: ' + curUser.lastName + ' to ' + updated.lastName);
    }
    if (updated.phone != curUser.phone) {
      User.findOneAndUpdate({username: curUser.username}, {$set: {phone: updated.phone}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('phone updated from: ' + curUser.phone + ' to ' + updated.phone);
    }
    if (updated.birthday != formattedBirthday) {
      let momentBirthday =  getLocalNoonDate(updated.birthday);
      User.findOneAndUpdate({username: curUser.username}, {$set: {birthday: momentBirthday}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('birthday updated from: ' + formattedBirthday + ' to ' + momentBirthday);
    }
    if (updated.email != curUser.email) {
      User.find({email: updated.email}, function(err, result) {
        if (err || result.length > 0) {
          console.log('Email Num Results: ' + result.length + ', Error: ' + err);
          req.flash('invalidEmail', 'Email already exists');
          res.redirect('/account');
        } else {
          User.findOneAndUpdate({username: curUser.username}, {$set: {email: updated.email}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
          console.log('email updated from: ' + curUser.email + ' to ' + updated.email);
        }
      });
    } 
    if (updated.username != curUser.username) {
      User.find({username: updated.username}, function(err, result) {
        if (err || result.length > 0) {
          console.log('Username Num Results: ' + result.length + ', Error: ' + err);
          res.setTimeout(500, function(){
            if (!res.headersSent) {
              req.flash('invalidUser', 'Username already exists');
              res.redirect('/account');
            }
          });
        } else {
          User.findOneAndUpdate({username: curUser.username}, {$set: {username: updated.username}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
          console.log('username updated from: ' + curUser.username + ' to ' + updated.username);
          res.setTimeout(300, function(){
            if (!res.headersSent) {
              req.flash('error', 'Please login with your new username');
              res.redirect('/login');
            }
          });
        }
      });
    } else {
      res.setTimeout(300, function(){
        if (!res.headersSent) {
          req.flash('success', 'Account has been updated');
          res.redirect('/account');
        }
      });
    }
  }
});

router.get('/forgotuser', isLoggedOut, function(req, res){
  res.render('forgotuser', {pageTitle: 'Forgot Username'});
});
router.post('/forgotuser', function(req, res){
  var userBirthday = req.body.forgotUser.birthday;
  var msg = 'No match found';
  User.find({email: req.body.forgotUser.email}, function(err, users) {
    if (err || users.length < 1) {
      console.log("email doesn't exist");
    } else {
      for (let i = 0; i < users.length; i++) {
        let storedBirthday = formatDate(users[i].birthday);
        console.log('storedBirthday: ' + storedBirthday + ', userBirthday: ' + userBirthday);
        if (storedBirthday.includes(userBirthday)) {
          msg = 'Username: ' + users[i].username;
          break;
        } else {
          console.log('birthday not a match');
        }
      }
    }
    req.flash('error', msg);
    return res.redirect('/forgotuser');
  });
});

router.get('/forgotpass', isLoggedIn, function(req, res){
  res.render('forgotpass', {pageTitle: 'Forgot Password'});
});
router.post('/forgotpass', function(req, res){
  var userBirthday = req.body.forgotPW.birthday;
  User.find({email: req.body.forgotPW.email, username: req.body.forgotPW.username}, function(err, users) {
    if (err || users.length < 1) {
      console.log("Could not find user with given details");
      req.flash('error', 'No match found');
      return res.redirect('/forgotpass');
    } else {
      for (let i = 0; i < users.length; i++) {
        let storedBirthday = formatDate(users[i].birthday);
        console.log('storedBirthday: ' + storedBirthday + ', userBirthday: ' + userBirthday);
        if (storedBirthday.includes(userBirthday)) {
          let curUser = users[i];
          console.log('Match found, logging in');
          // req.flash('changePassword', 'yes');
          // return res.redirect('/forgotpass');
          // res.render('forgotpass', {pageTitle: 'Forgot Password', changePassword: 'yes', userId: userId});
          req.login(curUser, function(err) {
            if (err) {
              return next(err);
            }
            return res.redirect('/forgotpass');
          });
          break;
        } else {
          console.log('birthday not a match');
          req.flash('error', 'No match found');
          return res.redirect('/forgotpass');
        }
      }
    }
  });
});

router.put('/forgotpass', isLoggedIn, function(req, res){ //both change and set don't work.. might need emails
  req.user.setPassword(req.body.password, function(err, user) {
    if(err){
      console.log(err);
    } else {
      console.log(user);
      console.log('Password changed to: ' + req.body.password);
      req.user.save();
      req.logout();
      req.flash('error', 'Password has been updated');
      res.redirect('/login');
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'Please login to access this feature');
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
