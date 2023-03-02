const express = require('express');
const router = express.Router();

const user = require('./users')


/* GET home page. */
router.use('/', user);

// router.get('/users', require('./users'));  

module.exports = router;
