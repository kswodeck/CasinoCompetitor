var express = require('express');
var router = express.Router();

router.get('/casual-cards', (req, res) => {
    res.render('casual-cards', {pageTitle: 'Poker'});
});

router.get('/casual-farkle', (req, res) => {
    res.render('casual-farkle', {pageTitle: 'Farkle'});
});

router.get('/dice', (req, res) => {
    res.render('dice', {pageTitle: 'Dice Roll'});
});

router.get('/coin', (req, res) => {
    res.render('coin', {pageTitle: 'Coin Flip'});
});

router.get('/contact', (req, res) => {
  res.render('contact', {pageTitle: 'Contact Us', emailSent: false});
});
router.post('/contact', (req, res) => {
  res.setTimeout(500, () => {
    res.render('contact', {pageTitle: 'Contact Us', emailSent: true});
  });
});

module.exports = router;
