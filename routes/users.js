var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('../public/structure/home.html');
});

module.exports = router;
