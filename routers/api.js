var express = require('express');
var router = express.Router();
var userDao = require('./../dao/userDao');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = module.exports = express();
var rooms={};
/* GET users listing. */
router.get('/', function(req, res, next) {
 // res.render('updateUser');
  res.sendFile('./public/index.html');
});
 
//  router.post('/ajax1.api', urlencodedParser, function(req, res, next){
//     /* req.body对象
//        包含POST请求参数。
//        这样命名是因为POST请求参数在REQUEST正文中传递，而不是像查询字符串在URL中传递。
//        要使req.body可用，可使用中间件body-parser
//     */
//     var type = req.body.type;
//     var info = req.body.info;
//     console.log("服务器收到一个Ajax ["+type+"] 请求，信息为："+info);
//     // res.json(['success', "服务器收到一个Ajax ["+type+"] 请求，信息为："+info]);
//      userDao.queryById(req, res, next);
// });

// router.get('/ajax2.api', function(req, res, next){
//     /* req.query对象
//        通常称为GET请求参数。
//        包含以键值对存放的查询字符串参数
//        req.query不需要任何中间件即可使用
//     */
//     // var type = req.query.type;
//     // var info = req.query.info;
//     // console.log("服务器收到一个2 Ajax ["+type+"] 请求，信息为："+info);
//     // res.json(['success', "服务器收到一个Ajax ["+type+"] 请求，信息为："+info]);
//     //userDao.queryAll(req, res, next);
//     userDao.add(req, res, next);
// });


//TODO 之后用openid查询
  router.get('/getuser.api', function(req, res, next){
      userDao.getuser(req, res, next);
  });

 router.post('/adduser.api', urlencodedParser, function(req, res, next){
    req.body.card=2;
    userDao.adduser(req, res, next);
});

  router.get('/getuser.api', function(req, res, next){
      userDao.getuser(req, res, next);
  });

  router.post('/adduser.api', urlencodedParser, function(req, res, next){
    req.body.card=2;
    userDao.adduser(req, res, next);
});


module.exports = router;