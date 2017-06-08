exports.initsock = function(server) {  
  	console.log('hello');  
	var socketIO = require('socket.io');
	var io = socketIO.listen(server);
	var counter = 0;
	var roomInfo = {'35503': { hoster: '12345' ,users: [123,456],
	     time: 1496655299370,
	     type: '1',
	     rule: '123' }};
	var allpai=[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33];

	function initPai(){
	  return Arrayshuffle(allpai);
	};

	function Arrayshuffle(arr) {
	  var input = arr;

	  for (var i = input.length-1; i >=0; i--) {

	      var randomIndex = Math.floor(Math.random()*(i+1));
	      var itemAtIndex = input[randomIndex];

	      input[randomIndex] = input[i];
	      input[i] = itemAtIndex;
	  }
	  return input;
	};
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
	          socket.to(roomid).emit('roominfo', userName, {code:'1',msg: userName+' join '+roomid+' ok'});
	          // 通知房间内人员
	          socket.to(roomid).emit('sys', user + '加入了房间', roomInfo[roomid]);
	          console.log(user + '加入了' + roomid);
	          console.log(roomInfo[roomid].users.length);
	          if (roomInfo[roomid].users.length==3) {
	            socket.to(roomid).emit('roominfo', roomid+" 有 "+ roomInfo[roomid].users+' 齐了');
	            var pais=initPai();
	            console.log(pais.length);
	            socket.to(roomid).emit('gameinfo',userName, {code:1,pailist:{pai:pais}});
	          };

	        }else{
	        	console.log('full');
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
	     
	      	var index = roomInfo[roomID].users.indexOf(user);
		    if (index !== -1) {
		      roomInfo[roomID].users.splice(index, 1);
		    }
		    console.log(user + '退出了' + roomID); 
	    });
	});

}  