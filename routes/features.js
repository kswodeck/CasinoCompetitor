var express = require('express');
var router = express.Router();

router.get('/practice-cards', function(req, res){
    res.render('practice-cards', {pageTitle: 'Practice Poker'});
});

router.get('/dice', function(req, res){
    res.render('dice', {pageTitle: 'Dice'});
});

router.get('/coin', function(req, res){
    res.render('coin', {pageTitle: 'Coin'});
});

// router.get("*", function (req, res, next) {
//     console.log(req); // do anything you want here
//     next();
//  });

module.exports = router;
