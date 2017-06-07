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
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var server = require('http').Server(app);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));



var socketIO = require('socket.io');
var io = socketIO.listen(server);
var counter = 0;
var roomInfo = {'35503': { hoster: '12345' ,users: [123],
     time: 1496655299370,
     type: '1',
     rule: '123' }};
io.sockets.on('connection', function(socket){
    console.log("connected!");
    var url = socket.request.headers;
    var user = ''; 
    var roomID='';
    // console.log(url);
    // socket.join(roomID); 


    socket.on('join', function (userName,roomid) {
      user = userName;
      roomID=roomid;
      console.log(roomInfo[roomid]);
      // 将用户昵称加入房间名单中
      if (!roomInfo[roomid]) {
        socket.emit('roominfo', userName, {code:'0',msg: 'not found'});

      }else{
        if(roomInfo[roomid].users.length<3){
          
          roomInfo[roomid].users.push(user);

          socket.join(roomid);    // 加入房间
          socket.emit('roominfo', userName, {code:'1',msg: userName+' join '+roomid+' ok'});
          // 通知房间内人员
          socket.to(roomid).emit('sys', user + '加入了房间', roomInfo[roomid]);
          console.log(user + '加入了' + roomid);

        }else{
          socket.emit('roominfo', userName, {code:'2',msg: 'people full'});
        }; 
      }         

    });    

    socket.on('leave', function () {
      socket.emit('disconnect');
    });


    io.sockets.emit('connected', { value: "server ok" });

    socket.on('handshake', function(data){
        console.log("receive handshake from client : " + data.value);
    });

    socket.on('message', function(data){
      console.log("message: " +data);

      if (roomInfo[roomID].users.indexOf(user) === -1) {  
        return false;
      }
      socket.to(roomID).emit('msg', user, data);
       //console.log(roomInfo[roomID]);

      // io.sockets.emit('confirmed', { value: "confirmed from server" });
    });

    socket.on('disconnect', function(){
      socket.leave(roomID);    // 退出房间
      io.sockets.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
      console.log(user + '退出了' + roomID);      
    });
});


// setInterval(function() {
//     counter++;
//    // console.log("Periodic broadcast:" + counter);
//     io.sockets.emit('broadcast', { value: "count:" + counter });
// }, 1000)




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