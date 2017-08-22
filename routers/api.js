var express = require('express');
var router = express.Router();
var userDao = require('./../dao/userDao');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = module.exports = express();

/* GET users listing. */
router.get('/', function(req, res, next) {
 // res.render('updateUser');
  res.sendFile('./public/index.html');
});



//TODO 之后用openid查询
  router.get('/getuser.api', function(req, res, next){
      userDao.getuser(req, res, next);
  });

  router.post('/adduser.api', urlencodedParser, function(req, res, next){
    req.body.card=2;
    userDao.adduser(req, res, next);
  });

  router.get('/joinroom.api', function(req, res, next){
    userDao.joinroom(req, res, next);
  });

  router.post('/addroom.api', urlencodedParser, function(req, res, next){
      userDao.addRoom(req, res, next);
  });
  router.post('/share.api', urlencodedParser, function(req, res, next){
      userDao.addShare(req, res, next);
  });

  router.get('/cashstatus.api', urlencodedParser, function(req, res, next){
      userDao.cashstatus(req, res, next);
  });

module.exports = router;