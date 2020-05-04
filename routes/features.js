var express = require('express');
var router = express.Router();

router.get('/casual-cards', function(req, res){
    res.render('casual-cards', {pageTitle: 'Poker'});
});

router.get('/casual-farkle', function(req, res){
    res.render('casual-farkle', {pageTitle: 'Farkle'});
});

router.get('/dice', function(req, res){
    res.render('dice', {pageTitle: 'Dice'});
});

router.get('/coin', function(req, res){
    res.render('coin', {pageTitle: 'Coin'});
});

module.exports = router;
