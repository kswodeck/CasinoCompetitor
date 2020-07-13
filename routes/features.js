var express = require('express');
var router = express.Router();

router.get('/casual-cards', (req, res) => {
    res.render('casual-cards', {pageTitle: 'Poker',
    description: 'Compete at this virtual casino with games such as poker, farkle, dice rolling, and coin flipping. Play competitively to claim the top place on the leaderboard.'});
});

router.get('/casual-farkle', (req, res) => {
    res.render('casual-farkle', {pageTitle: 'Farkle',
    description: 'Compete at this virtual casino with games such as poker, farkle, dice rolling, and coin flipping. Play competitively to claim the top place on the leaderboard.'});
});

router.get('/dice', (req, res) => {
    res.render('dice', {pageTitle: 'Dice Roll',
    description: 'Compete at this virtual casino with games such as poker, farkle, dice rolling, and coin flipping. Play competitively to claim the top place on the leaderboard.'});
});

router.get('/coin', (req, res) => {
    res.render('coin', {pageTitle: 'Coin Flip',
    description: 'Compete at this virtual casino with games such as poker, farkle, dice rolling, and coin flipping. Play competitively to claim the top place on the leaderboard.'});
});

router.get('/contact', (req, res) => {
  res.render('contact', {pageTitle: 'Contact Us', emailSent: false,
  description: 'Compete at this virtual casino with games such as poker, farkle, dice rolling, and coin flipping. Play competitively to claim the top place on the leaderboard.'});
});
router.post('/contact', (req, res) => {
  res.setTimeout(500, () => {
    res.render('contact', {pageTitle: 'Contact Us', emailSent: true,
    description: 'Compete at this virtual casino with games such as poker, farkle, dice rolling, and coin flipping. Play competitively to claim the top place on the leaderboard.'});
  });
});

module.exports = router;
