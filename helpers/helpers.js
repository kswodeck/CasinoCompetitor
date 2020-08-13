const moment   = require('moment'),
      badWords = require('../helpers/words');

function getLocalNoonDate(date) { //used to assume birthday times
  let adjustedTime = 12 + (moment().utcOffset()/60); //makes the date time 12
  let inputDate = date + ' ' + adjustedTime + ':00';
  return moment().format(inputDate);
}

function formatDate(date) {
  let unformattedDate = date.toString();
  let formattedYear = unformattedDate.slice(11, 15);
  let formattedMonth = unformattedDate.slice(4, 7);
  formattedMonth = getMonthNum(formattedMonth);
  let formattedDay = unformattedDate.slice(8, 10);
  // let formattedDate = formattedYear + '-' + formattedMonth + '-' + formattedDay; // yyyy-mm-dd format
  let formattedDate = formattedMonth + '-' + formattedDay + '-' + formattedYear; // mm-dd-yyyy format
  return formattedDate;
}

function getMonthNum(month) {
  month === 'Jan' ? month = '01' : month === 'Feb' ? month = '02' : month === 'Mar' ? month = '03' : month === 'Apr' ? month = '04' :
  month === 'May' ? month = '05' : month === 'Jun' ? month = '06' : month === 'Jul' ? month = '07' :  month === 'Aug' ? month = '08' :
  month === 'Sep' ? month = '09' : month === 'Oct' ? month = '10' : month === 'Nov' ? month = '11' : month = '12';
  return month;
}

function getCurrentDate() {
  let adjustedTime = moment().hour()+(moment().utcOffset()/60);
  let todayDate = moment().date();
  if (adjustedTime < 0) {
    todayDate = (moment().date()-1);
    adjustedTime = (24 + adjustedTime);
  }
  let dateReturned = moment().year() + '-'+ (moment().month()+1) + '-' + todayDate +
  ' ' + adjustedTime + ':' + moment().minutes() + ':' + moment().seconds() + '.' + moment().milliseconds();
  return dateReturned;
}

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

function updateCoins(req, res) {
  let newCoins = req.body.coins, curWin = req.body.currentWin;
  if (newCoins != req.user.coins) { //update coins
    User.findOneAndUpdate({username: req.user.username}, {$set: {coins: newCoins}}, {useFindAndModify: false, rawResult: true}, (req, res) => {});
  }
  if (curWin > req.user.highestWin) { //update highestWin
    User.findOneAndUpdate({username: req.user.username}, {$set: {highestWin: curWin}}, {useFindAndModify: false, rawResult: true}, (req, res) => {});
  }
  return res.status(204).send();
}

function containsBadWord(word) {
  for (let i = 0; i < badWords.length; i++) {
    if (word.includes(badWords[i])) {
      console.log(badWords[i]);
      return true;
    }
  }
  return false;
}

module.exports.getLocalNoonDate = getLocalNoonDate;
module.exports.isLoggedIn = isLoggedIn;
module.exports.isLoggedOut = isLoggedOut;
module.exports.updateCoins = updateCoins;
module.exports.containsBadWord = containsBadWord;
module.exports.formatDate = formatDate;
module.exports.getCurrentDate = getCurrentDate;