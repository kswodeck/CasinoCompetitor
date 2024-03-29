/* eslint-disable no-unused-vars */
const express  = require('express'),
      passport = require('passport'),
      router   = express.Router({mergeParams: true}),
      moment   = require('moment'),
      User     = require('../models/user'),
      helpers  = require('../public/javascripts/helpers');

// account, authentication, and routes only for logged in users
router.get('/', (req, res) => {
  var afterLogin, loggedInToday = true;
  if (req.query.afterLogin) {
    afterLogin = req.query.afterLogin;
  } else {
    afterLogin = false;
  }
  if (req.user && afterLogin) {
    let adjYesDate = new Date(moment().subtract(1, 'days').format());
    let yesterday = helpers.formatDate(adjYesDate);
    let current = new Date(helpers.getCurrentDate());
    let today = helpers.formatDate(current);
    let last = new Date(req.user.lastLogin);
    let lastLoginDate = helpers.formatDate(last);
    let streak = req.user.loginStreak;
    let coins = req.user.coins;
    if (yesterday == lastLoginDate) {
      streak = streak + 1;
      coins = coins + (streak*10);
      loggedInToday = false;
    } else if (today != lastLoginDate) { //this situation may be off.. try logging in with kswodeck2 on 8/30
      coins = coins + 10;
      streak = 1;
      loggedInToday = false;
    }
    User.findOneAndUpdate({_id: req.user._id}, {$set: {lastLogin: current, loginStreak: streak, coins: coins}}, {runValidators: true, useFindAndModify: false, rawResult: true}, (err, user) => {
      if (!err && user) {
        res.render('index', {pageTitle: 'Casino Competitor', loggedInToday: loggedInToday, streak: streak});
      }
    });
  } else {
    res.render('index', {pageTitle: 'Casino Competitor', loggedInToday: true, streak: 0});
  }
});

router.get('/cards', helpers.isLoggedIn, (req, res) => {
  res.render('cards', {pageTitle: 'Competitive Poker', currentCoins: req.user.coins});
});
router.put('/cards', helpers.isLoggedIn, (req, res) => {
  helpers.updateCoins(req, res);
});

router.get('/farkle', helpers.isLoggedIn, (req, res) => {
  res.render('farkle', {pageTitle: 'Competitive Farkle', currentCoins: req.user.coins});
});
router.put('/farkle', helpers.isLoggedIn, (req, res) => {
  helpers.updateCoins(req, res);
});

router.get('/leaderboard', helpers.isLoggedIn, (req, res) => {
  var search = "", page = 1; // initializes default variables
  if (req.query.page) { // if a page query string exists
    page = req.query.page; //gets the page number from query string
  }
  if (req.query.search) { // if a page query string exists
    search = req.query.search; //gets the search term from query string
  }
  var cur = (page-1)*100; // calculates 100 users on the corresponding page
  var pageUsers = [], userRanks = []; //declare arrays to store users and ranks
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) { //returns all users starting from highest coins
    if (err || !allUsers) { // no users found or error
      return res.render('leaderboard', {pageTitle: 'Leaderboard', pageUsers: 0, users: 0, ranks: 0, search: "", curPage: 1}); //returns empty page
    } else {
      if (search == "") { //no search was made
        if (cur >= allUsers.length || page < 1 || isNaN(page)) { //handles invalid page queries
          return res.status(204).send(); // return the same url the user come from
        }
        for (let i = cur; i < cur+100 && i < allUsers.length; i++) { // gets top 100 users on unsearched leaderboard
          pageUsers.push(allUsers[i]); //store users onto page
          userRanks.push(i+1); //store ranks alongside users
        }
          return res.render('leaderboard', {pageTitle: 'Leaderboard', pageUsers: pageUsers, users: allUsers, ranks: userRanks, search: search, curPage: page});
      } else {
        User.find({username: new RegExp(search, 'i')}).sort({coins: -1}).exec(function(err, users) { //find users using the search query
          if (err || users.length == 0) { //no users found from search OR error
            return res.redirect('/leaderboard'); //restore leaderboard to initial state
          } else {
            if (cur >= users.length || page < 1 || isNaN(page)) { //handles invalid page queries
              return res.status(204).send(); // return the same url the user come from
            }
            var i = cur, j = cur; //initialize incrementing variables according to the corresponding page
            while (j < cur+100 && i < allUsers.length && j < users.length) { // sorts and ranks the searched leaderboard
              let allId = allUsers[i]._id.toString(), usersId = users[j]._id.toString(); //converts user ids to strings
              if (usersId == allId) { //only store users that exist and were searched and found
                pageUsers.push(users[j]); //store found users onto page
                userRanks.push(i+1); //store ranks alongside users
                j++; //increment found user count
              }
              i++; //increment all user count
            }
            return res.render('leaderboard', {pageTitle: 'Leaderboard', pageUsers: pageUsers, users: users, ranks: userRanks, search: search, curPage: page});
          }
        });
      }
    }
  });
});

router.get('/register', helpers.isLoggedOut, (req, res) => {
  res.render('register', {pageTitle: 'Create Account'});
});
router.post('/register', helpers.isLoggedOut, (req, res) => {
  User.find({email: req.body.email}, (err, emails) => {
    if (err || emails.length > 0) {
      req.flash('error', 'Email "' + req.body.email + '" is already registered');
      res.redirect('/register');
    } else {
      User.find({username: req.body.username}, (err, usernames) => {
        if (err || usernames.length > 0) {
          req.flash('error', 'Username "' + req.body.username + '" is already registered');
          res.redirect('/register');
        } else {
          const username = req.body.username;
          let momentBirthday = helpers.getLocalNoonDate(req.body.birthday);
          var newUser = new User({email: req.body.email, username: username, firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone, birthday: momentBirthday, profileImage: req.body.profileImage});
          User.register(newUser, req.body.password, (err, user) => {
              if (err || !user){
                req.flash('error', err);
                res.redirect('/register');
              } else {
                passport.authenticate('local')(req, res, () => {
                  res.redirect('/');
              });
            }
          });
        }
      });
    }
  });
});

router.get('/login', helpers.isLoggedOut, (req, res) => {
  res.render('prelogin', {pageTitle: 'Login'});
});
router.post('/login', helpers.isLoggedOut, passport.authenticate('local', {
  successRedirect: '/?afterLogin=true',
  failureFlash: 'Incorrect username or password',
  failureRedirect: '/login'
}));

router.get('/logout', helpers.isLoggedIn, (req, res) => {
  req.logout();
  req.flash('popup', true);
  res.redirect('/');
});

router.get('/account', helpers.isLoggedIn, (req, res) => {
  let formattedBirthday = helpers.formatDate(req.user.birthday);
  return res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, error: false});
});
router.put('/account', helpers.isLoggedIn, (req, res) => {
  var curUser = req.user, updated = req.body.updateUser;
  if (req.body.updatePassword) {
      curUser.changePassword(req.body.oldPassword, req.body.updatePassword, (err, user) => {
        if (err || !user){
          return res.status(204).send();
        } else {
          req.flash('success', 'Account has been updated');
          res.redirect('/account');
        }
      });
  } else {
    var formattedBirthday = helpers.formatDate(curUser.birthday);
    if (updated.firstName != curUser.firstName) {
      User.findOneAndUpdate({_id: curUser._id}, {$set: {firstName: updated.firstName}}, {runValidators: true, useFindAndModify: false, rawResult: true}, (req, res) => {});
    } 
    if (updated.lastName != curUser.lastName) {
      User.findOneAndUpdate({_id: curUser._id}, {$set: {lastName: updated.lastName}}, {runValidators: true, useFindAndModify: false, rawResult: true}, (req, res) => {});
    }
    if (updated.phone != curUser.phone) {
      User.findOneAndUpdate({_id: curUser._id}, {$set: {phone: updated.phone}}, {useFindAndModify: false, rawResult: true}, (req, res) => {});
    }
    if (updated.birthday != formattedBirthday) {
      let momentBirthday =  helpers.getLocalNoonDate(updated.birthday);
      User.findOneAndUpdate({_id: curUser._id}, {$set: {birthday: momentBirthday}}, {useFindAndModify: false, rawResult: true}, (req, res) => {});
    }
    if (updated.profileImage != curUser.profileImage) {
      User.findOneAndUpdate({_id: curUser._id}, {$set: {profileImage: updated.profileImage}}, {useFindAndModify: false, rawResult: true}, (req, res) => {});
    }
    if (updated.email != curUser.email) {
      User.find({email: updated.email}, (err, result) => {
        if (err || result.length > 0) {
          req.flash('invalidEmail', 'Email "' + updated.email + '" already exists');
          res.redirect('/account');
        } else {
          User.findOneAndUpdate({_id: curUser._id}, {$set: {email: updated.email}}, {runValidators: true, useFindAndModify: false, rawResult: true}, (req, res) => {});
        }
      });
    } 
    if (updated.username != curUser.username) {
        User.find({username: updated.username}, (err, result) => {
          if (err || result.length > 0) {
            res.setTimeout(500, () => {
              if (!res.headersSent) {
                req.flash('invalidUser', 'Username "' + updated.username + '" already exists');
                res.redirect('/account');
              }
            });
          } else {
            User.findOneAndUpdate({_id: curUser._id}, {$set: {username: updated.username}}, {runValidators: true, useFindAndModify: false, rawResult: true}, (req, res) => {});
            res.setTimeout(700, () => {
              if (!res.headersSent) {
                req.flash('error', 'Please login with your new username');
                res.redirect('/login');
              }
            });
          }
        });
    } else {
      res.setTimeout(400, () => {
          req.flash('success', 'Account has been updated');
          res.redirect('/account');
      });
    }
  }
});
router.delete('/account', helpers.isLoggedIn, (req, res) => {
  req.user.changePassword(req.body.password, req.body.password, (err, user) => {
    if (err || !user){
      req.flash('invalidPW', 'You entered an incorrect password');
      res.redirect('/account');
    } else {
      User.findByIdAndDelete(req.user._id, (err, users) => {
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

router.get('/forgotuser', helpers.isLoggedOut, (req, res) => {
  res.render('prelogin', {pageTitle: 'Forgot Username'});
});
router.post('/forgotuser', helpers.isLoggedOut, (req, res) => {
  var userBirthday = req.body.forgotUser.birthday;
  var msg = 'No match found';
  User.find({email: req.body.forgotUser.email, phone: req.body.forgotUser.phone}, (err, users) => {
    if (!err || users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        let storedBirthday = helpers.formatDate(users[i].birthday);
        if (storedBirthday.includes(userBirthday)) {
          msg = 'Username: ' + users[i].username;
          break;
        }
      }
    }
    req.flash('error', msg);
    return res.redirect('/forgotuser');
  });
});

router.get('/forgotpass', helpers.isLoggedOut, (req, res) => {
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
router.post('/forgotpass', helpers.isLoggedOut, (req, res) => {
  var userBirthday = req.body.forgotPW.birthday;
  User.find({email: req.body.forgotPW.email, phone: req.body.forgotPW.phone}, (err, users) => {
    if (err || users.length < 1) {
      req.flash('error', 'No match found');
      return res.redirect('/forgotpass');
    } else {
      for (let i = 0; i < users.length; i++) {
        let storedBirthday = helpers.formatDate(users[i].birthday);
        if (storedBirthday.includes(userBirthday)) {
          let curUser = users[i];
          User.findByIdAndUpdate(curUser._id, {passwordRecoveryActive: true}, {useFindAndModify: false}, (error, user) => {
            if (error || !user) {
              req.flash('error', 'An error occured');
              res.redirect('/forgotpass');
            } else {
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
router.get('/forgotpass/:id', helpers.isLoggedOut, (req, res) => { //route to update password page for forgot password update
  User.findOne({_id: req.params.id, passwordRecoveryActive: true}, (err, user) => {
    if (err || !user) {
      res.redirect('/');
    } else {
      res.render('forgotpass', {pageTitle: 'Update Password', emailSent: false, updatePW: true, userId: req.params.id, username: req.params.username});
    }
  });
});
router.put('/forgotpass/:id', helpers.isLoggedOut, (req, res) => { //route for forgotten password update
  User.findByIdAndUpdate(req.params.id, {passwordRecoveryActive: false}, {useFindAndModify: false}, (error, user) => {
    if (error || !user) {
      res.redirect('/forgotpass');
    } else {
      req.login(user, (err) => {
        if (err) {
          return err;
        } else {
          res.setTimeout(200, () => {
            req.user.setPassword(req.body.password, (e, user) => {
              if (!e || user){
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

module.exports = router;

