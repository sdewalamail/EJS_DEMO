const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

// router.get('/users', require('./users'));  

module.exports = router;
