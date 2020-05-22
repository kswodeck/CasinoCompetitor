/* eslint-disable no-unused-vars */
var express  = require('express');
var passport = require('passport'),
    router   = express.Router({mergeParams: true}),
    moment   = require('moment'),
    User     = require('../models/user');

// User and authentication related routes
router.get('/', function(req, res){
  var afterLogin, changedLastLogin;
  if (req.query.afterLogin) {
    afterLogin = req.query.afterLogin;
  } else {
    afterLogin = false;
  }
  if (req.user && afterLogin) {
    var current = new Date(User.getCurrentDate());
    let adjYesDate = moment().subtract(1, 'days').format();
    let strYesDate = adjYesDate.toString();
    let yesterday = strYesDate.slice(0, 10);
    let curDate = moment().format();
    let strCurDate = curDate.toString();
    let today = strCurDate.slice(0, 10);
    console.log('Today: ' + today);
    console.log('Yesterday: ' + yesterday);
    let last = new Date(req.user.lastLogin);
    let lastLoginDate = formatDate(last);
    console.log('Last: ' + lastLoginDate); 
    var newStreak = 1;
    let addCoins = newStreak*10;
    var newCoins = req.user.coins + addCoins;
    if (yesterday == lastLoginDate) {
      newStreak = req.user.loginStreak + 1;
      addCoins = newStreak*10;
      newCoins = req.user.coins + addCoins;
      changedLastLogin = false;
    } else if (today == lastLoginDate) {
      newCoins = req.user.coins;
      changedLastLogin = true;
    } else {
      changedLastLogin = false;
    }
    if (changedLastLogin && afterLogin) {
      User.findOneAndUpdate({_id: req.user._id}, {$set: {lastLogin: current}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('updated lastLogin to ' + current);
    } else if (afterLogin){
      User.findOneAndUpdate({_id: req.user._id}, {$set: {loginStreak: newStreak, lastLogin: current, coins: newCoins}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('updated loginStreak to ' + newStreak);
      console.log('updated coins to ' + newCoins);
      console.log('updated lastLogin to ' + current);
    } else {
      changedLastLogin = true;
    }
    res.render('index', {pageTitle: 'Casino Competitor', fromLogout: false, loggedInToday: changedLastLogin, streak: newStreak, coins: newCoins, updatePW: false});
  } else {
    var streak, coins;
    if (req.user) {
      streak = req.user.loginStreak;
      coins = req.user.coins;
    }
    res.render('index', {pageTitle: 'Casino Competitor', fromLogout: false, loggedInToday: true, streak: streak, coins: coins, updatePW: false});
  }
});

router.get('/cards', isLoggedIn, function(req, res){
  res.render('cards', {pageTitle: 'Competitive Poker', currentCoins: req.user.coins});
});
router.put('/cards', isLoggedIn, function(req, res){ //possibly combine into function
  if (req.body.userCoins != req.user.coins) { //update coins
    console.log('updating coins: ' + req.user.coins + ' to ' + req.body.userCoins);
    User.findOneAndUpdate({username: req.user.username}, {$set: {coins: req.body.userCoins}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
  }
  if (req.body.currentWin > req.user.highestWin) { //update highestWin
    console.log('updating highestWin: ' + req.user.highestWin + ' to ' + req.body.currentWin);
    User.findOneAndUpdate({username: req.user.username}, {$set: {highestWin: req.body.currentWin}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
  }
  return res.status(204).send();
});

router.get('/farkle', isLoggedIn, function(req, res){
  res.render('farkle', {pageTitle: 'Competitive Farkle', currentCoins: req.user.coins});
});
router.put('/farkle', isLoggedIn, function(req, res){ //possibly combine into function
  if (req.body.userCoins != req.user.coins) { //update coins
    console.log('updating coins: ' + req.user.coins + ' to ' + req.body.userCoins);
    User.findOneAndUpdate({username: req.user.username}, {$set: {coins: req.body.userCoins}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
  }
  if (req.body.currentWin > req.user.highestWin) { //update highestWin
    console.log('updating highestWin: ' + req.user.highestWin + ' to ' + req.body.currentWin);
    User.findOneAndUpdate({username: req.user.username}, {$set: {highestWin: req.body.currentWin}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
  }
  return res.status(204).send();
});

router.get('/leaderboard', isLoggedIn, function(req, res){
  var search = "", page = 1;
  if (req.query.page) {
    page = req.query.page; //gets the page number from query string
  }
  if (req.query.search) {
    search = req.query.search; //gets the search text from query string
  }
  var cur = (page-1)*100;
  var pageUsers = [], userRanks = [];
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) {
    if (err || !allUsers) {
      console.log(err);
    } else {
      if (search == "") {
        for (let i = cur; i < cur+100 && i < allUsers.length; i++) { // gets the first 100 users on initial leaderboard
          pageUsers.push(allUsers[i]);
          userRanks.push(i+1);
        }
          return res.render('leaderboard', {pageTitle: 'Leaderboard', pageUsers: pageUsers, users: allUsers, ranks: userRanks, search: search});
      } else {
        User.find({username: new RegExp(search, 'i')}).sort({coins: -1}).exec(function(err, users) {
          if (err || !users) {
            console.log(err);
          } else {
            var i = cur, j = cur;
            var numUsers = users.length, numAll = allUsers.length;
            var waitTime = (allUsers.length + users.length) / 2;
            while (i < cur+100 && i < numAll && j < numUsers) { // sorts and ranked the searched leaderboard
              let allId = allUsers[i]._id.toString(), usersId = users[j]._id.toString();
              if (usersId == allId) {
                pageUsers.push(users[j]);
                userRanks.push(i+1);
                j++;
              }
              i++;
            }
          }
          res.setTimeout(waitTime, function() { // dynamic wait based on the number of users in db and number of users resulted from search
            return res.render('leaderboard', {pageTitle: 'Leaderboard', pageUsers: pageUsers, users: users, ranks: userRanks, search: search});
          });
        });
      }
    }
  });
});

router.get('/register', isLoggedOut, function(req, res){
  res.render('register', {pageTitle: 'Create Account'});
});
router.post('/register', isLoggedOut, function(req, res){
  User.find({email: req.body.email}, function(err, emails){
    if (err || emails.length > 0) { // desire to display UI errors without refreshing page (need user's editted values to stay)
      req.flash('error', 'Email "' + req.body.email + '" is already registered');
      res.redirect('/register');
      // res.status(204).send(); // seem like best option to use this then timeout and display generic message on UI
    } else {
      User.find({username: req.body.username}, function(err, usernames) {
        if (err || usernames.length > 0) {
          req.flash('error', 'Username "' + req.body.username + '" is already registered');
          res.redirect('/register');
          // res.status(204).send(); // seem like best option to use this then timeout and display generic message on UI
        } else {
          let momentBirthday = getLocalNoonDate(req.body.birthday);
          var newUser = new User({email: req.body.email, username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone, birthday: momentBirthday});
          User.register(newUser, req.body.password, function(err, user){
              if (err || !user){
                req.flash('error', err);
                res.redirect('/register');
              } else {
                console.log(user);
                passport.authenticate('local')(req, res, function(){
                  res.redirect('/?firstLogin=' + true);
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
router.post('/login', isLoggedOut, passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Incorrect username or password',
}), function(req, res){
  res.redirect('/?afterLogin=' + true);
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
router.put('/account', isLoggedIn, function(req, res){
  var curUser = req.user, updated = req.body.updateUser;
  if (req.body.updatePassword) {
      curUser.changePassword(req.body.oldPassword, req.body.updatePassword, function(err, user) { // will use email instead
        if (err || !user){
          console.log(err);
          return res.status(204).send();
        } else {
          console.log('Password changed to: ' + req.body.updatePassword + 'for ' + user.username);
          req.flash('success', 'Account has been updated');
          res.redirect('/account');
        }
      });
  } else {
    var formattedBirthday = formatDate(curUser.birthday);
    if (updated.firstName != curUser.firstName) {
      User.findOneAndUpdate({_id: curUser._id}, {$set: {firstName: updated.firstName}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('firstName updated from: ' + curUser.firstName + ' to ' + updated.firstName);
    } 
    if (updated.lastName != curUser.lastName) {
      User.findOneAndUpdate({_id: curUser._id}, {$set: {lastName: updated.lastName}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('lastName updated from: ' + curUser.lastName + ' to ' + updated.lastName);
    }
    if (updated.phone != curUser.phone) {
      User.findOneAndUpdate({_id: curUser._id}, {$set: {phone: updated.phone}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('phone updated from: ' + curUser.phone + ' to ' + updated.phone);
    }
    if (updated.birthday != formattedBirthday) {
      let momentBirthday =  getLocalNoonDate(updated.birthday);
      User.findOneAndUpdate({_id: curUser._id}, {$set: {birthday: momentBirthday}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
      console.log('birthday updated from: ' + formattedBirthday + ' to ' + momentBirthday);
    }
    if (updated.email != curUser.email) {
      User.find({email: updated.email}, function(err, result) {
        if (err || result.length > 0) {
          console.log('Email Num Results: ' + result.length + ', Error: ' + err);
          req.flash('invalidEmail', 'Email "' + updated.email + '" already exists');
          res.redirect('/account');
        } else {
          User.findOneAndUpdate({_id: curUser._id}, {$set: {email: updated.email}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
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
              req.flash('invalidUser', 'Username "' + updated.username + '" already exists');
              res.redirect('/account');
            }
          });
        } else {
          User.findOneAndUpdate({_id: curUser._id}, {$set: {username: updated.username}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
          console.log('username updated from: ' + curUser.username + ' to ' + updated.username);
          res.setTimeout(700, function(){
            if (!res.headersSent) {
              req.flash('error', 'Please login with your new username');
              res.redirect('/login');
            }
          });
        }
      });
    } else {
      res.setTimeout(400, function(){
          req.flash('success', 'Account has been updated');
          res.redirect('/account');
      });
    }
  }
});
router.delete('/account', isLoggedIn, function(req, res){
  req.user.changePassword(req.body.password, req.body.password, function(err, user) {
    if (err || !user){
      req.flash('invalidPW', 'You entered an incorrect password');
      res.redirect('/account');
    } else {
      User.findByIdAndDelete(req.user._id, function(err, users) {
        if (err || !users) {
          req.flash('invalidPW', err);
          res.redirect('/account');
        } else {
          req.flash('error', 'Successfully deleted your account');
          res.redirect('/login');
        }
      });
    }
  });
});

router.get('/forgotuser', isLoggedOut, function(req, res){
  res.render('forgotuser', {pageTitle: 'Forgot Username'});
});
router.post('/forgotuser', isLoggedOut, function(req, res){
  var userBirthday = req.body.forgotUser.birthday;
  var msg = 'No match found';
  User.find({email: req.body.forgotUser.email, phone: req.body.forgotUser.phone}, function(err, users) {
    if (err || users.length < 1) {
      console.log("email and phone combination doesn't exist");
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

router.get('/forgotpass', function(req, res){
  let emailSent = false, userId = false, username = false;

  if (req.query.emailSent) {
    emailSent = req.query.emailSent;
  }
  if (req.query.userId) {
    userId = req.query.userId;
  }
  if (req.query.username) {
    username = req.query.username;
  }
  res.render('forgotpass', {pageTitle: 'Forgot Password', emailSent: emailSent, userId: userId, username: username, updatePW: false});
});
router.post('/forgotpass', function(req, res){
  var userBirthday = req.body.forgotPW.birthday;
  User.find({email: req.body.forgotPW.email, phone: req.body.forgotPW.phone}, function(err, users) {
    if (err || users.length < 1) {
      req.flash('error', 'No match found');
      return res.redirect('/forgotpass');
    } else {
      for (let i = 0; i < users.length; i++) {
        let storedBirthday = formatDate(users[i].birthday);
        if (storedBirthday.includes(userBirthday)) {
          let curUser = users[i];
          User.findByIdAndUpdate(curUser._id, {passwordRecoveryActive: true}, {useFindAndModify: false}, function(error, user) {
            if (error || !user) {
              req.flash('error', 'An error occured');
              res.redirect('/forgotpass');
            } else {
              console.log('Match found, sending email');
              req.flash('success', 'password recovery email sent');
              res.redirect('/forgotpass?emailSent=' + req.body.forgotPW.email + '&userId=' + curUser._id + '&username=' + curUser.username);
            }
          });
          break;
        } else {
          req.flash('error', 'No match found');
          return res.redirect('/forgotpass');
        }
      }
    }
  });
});
router.get('/forgotpass/:id', isLoggedOut, function(req, res){ //route to update password page for forgot password update
  User.findOne({_id: req.params.id, passwordRecoveryActive: true}, function(err, user) {
    if (err || !user) {
      res.redirect('/');
    } else {
      res.render('forgotpass', {pageTitle: 'Update Password', updatePW: true, emailSent: false, userId: req.params.id, username: req.params.username});
    }
  });
});
router.put('/forgotpass/:id', isLoggedOut, function(req, res){ //route for forgotten password update
  User.findByIdAndUpdate(req.params.id, {passwordRecoveryActive: false}, {useFindAndModify: false}, function(error, user) {
    if (error || !user) {
      res.redirect('/forgotpass');
    } else {
      req.login(user, function(err) {
        if (err) {
          return err;
        } else {
          res.setTimeout(200, function(){
            req.user.setPassword(req.body.password, function(e, user) {
              if (e || !user){
                console.log(e);
              } else {
                console.log('Password changed to: ' + req.body.password);
                req.user.save();
                req.logout();
                req.flash('error', 'Password has been updated');
                res.redirect('/login');
              }
            });
        });
        }
      });
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
