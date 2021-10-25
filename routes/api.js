const express = require('express');
const router = express.Router();
const helper = require('../helpers/helper');

router.route('/api/user/signup')
  .post(helper.registeruser)

router.route('/api/user/login')
  .post(helper.login)

module.exports = router;