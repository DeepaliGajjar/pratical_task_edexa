const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const helper = require('../helpers/helper');
const multer  = require('multer')
const upload = multer({ dest: 'public/' })

router.route('/api/user/signup')
  .post(upload.any(),helper.registeruser)

router.route('/api/user/login')
  .post(helper.login)

router.route('/api/user/addpercent')
  .post(helper.addpercent)

router.route('/api/user/getpercent')
  .get(helper.getpercent)

router.route('/api/user/addtip')
  .post(helper.addtip)

router.route('/api/user/gettip')
  .get(helper.gettip)

router.route('/api/user/getfilteredtip')
  .post(helper.getfilteredtip)
  

module.exports = router;