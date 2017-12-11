const Auth = require('./auth.js')
const Upload = require('./upload.js')
var debug = require('debug')('koa-router');
const router = require('koa-router')()

router
      .get('/auth', Auth.getCode)
      .post('/upload', Upload.getCode)
module.exports = router;
