var express = require('express');
var path = require('path');
var router = express.Router();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routers/api');

var port=3010;


var app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var server = require('http').Server(app);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

var sock = require('./js/socketjs');
sock.initsock(server);  

// // room page
// router.get('/room/:roomID', function (req, res) {
//   var roomID = req.params.roomID;

//   // 渲染页面数据(见views/room.hbs)
//   res.render('room', {
//     roomID: roomID,
//     users: roomInfo[roomID]
//   });
// });

// // room page
router.get('/gamestart', function (req, res) {
  res.sendFile(path.join(__dirname, './public/start.html'));
});

router.get('/room', function (req, res) {

  res.sendFile(path.join(__dirname, 'room.html'));
});

app.use('/', router);
app.use('/api', api);

server.listen(3010, function () {
  console.log('server listening on port 3010');
});