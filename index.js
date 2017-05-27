// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var path = require('path');

// app.get('/', function(req, res){
//    res.sendFile(__dirname + '/client/index.html');
// });

// io.on('connection', function(socket){

// 	// socket.on('message', function (msg) {    
//  //            io.emit('message',msg);

//  //    });

//     //客户端请求ws URL:  http://127.0.0.1:6001?roomid=k12_webcourse_room_1
//     var roomid = socket.handshake.query.roomid;
//     console.log(socket.handshake.query);
//     console.log('worker pid: ' + process.pid  + ' join roomid: '+ roomid);

//   // 	socket.on('join', function (data) {

//   //       socket.join(roomid);    //加入房间

     
//   //     console.log(data.username + ' join, IP: ' + socket.client.conn.remoteAddress);
//   // });

//     socket.on('join', function (room) {
//         socket.join(room);
//         console.log(room);
//         io.emit('message','加入'+room);
//         inRoom = room;
//     });

//   	socket.on('chat message', function(msg){
//     	console.log('message: ' + msg);
//     	socket.send('sever:' + msg);
//      io.emit('chat message', msg);
//   	});


// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

var express = require('express');
var path = require('path');
var IO = require('socket.io');
var router = express.Router();

var app = express();
var server = require('http').Server(app);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

// 创建socket服务
var socketIO = IO(server);
// 房间用户名单
var roomInfo = {};

socketIO.on('connection', function (socket) {
  // 获取请求建立socket连接的url
  // 如: http://localhost:3000/room/room_1, roomID为room_1
  var url = socket.request.headers.referer;
  var splited = url.split('/');
  var roomID = 'room1';   // 获取房间ID
  var user = '';

  socket.on('join', function (userName) {
    user = userName;

    // 将用户昵称加入房间名单中
    if (!roomInfo[roomID]) {
      roomInfo[roomID] = [];
    }
    roomInfo[roomID].push(user);

    socket.join(roomID);    // 加入房间
    // 通知房间内人员
    socketIO.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);  
    console.log(user + '加入了' + roomID);
  });

  socket.on('leave', function () {
    socket.emit('disconnect');
  });

  socket.on('disconnect', function () {
    // 从房间名单中移除
    var index = roomInfo[roomID].indexOf(user);
    if (index !== -1) {
      roomInfo[roomID].splice(index, 1);
    }

    socket.leave(roomID);    // 退出房间
    socketIO.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
    console.log(user + '退出了' + roomID);
  });

  // 接收用户消息,发送相应的房间
  socket.on('message', function (msg) {
    // 验证如果用户不在房间内则不给发送
    if (roomInfo[roomID].indexOf(user) === -1) {  
      return false;
    }
    console.log(msg);
    socketIO.to(roomID).emit('msg', user, msg);
  });

});

// room page
router.get('/room/:roomID', function (req, res) {
  var roomID = req.params.roomID;

  // 渲染页面数据(见views/room.hbs)
  // res.render('room', {
  //   roomID: roomID,
  //   users: roomInfo[roomID]
  // });
});

app.use('/', router);

server.listen(3000, function () {
  console.log('server listening on port 3000');
});