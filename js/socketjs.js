exports.initsock = function(server) {  
  	console.log('hello');  
	var socketIO = require('socket.io');
	var io = socketIO.listen(server);
	var counter = 0;
	var roomInfo = {};
	var allpai=[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33];
	var _socket;

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

	function newGame(roomid,players){
		// console.log(players);
		var pais=roomInfo[roomid].pais;
		var pai={};
		pai.p0=pais.slice(0,14);
		pai.p1=pais.slice(14,27);
		pai.p2=pais.slice(27,40);
		pai.p3=pais.slice(40,53);
		var turnseat=roomInfo[roomid].turn%4;
	    for (var i = 0; i < players.length; i++) {
	    	 io.sockets.in(players[i]).emit('gameinfo',players[i], {code:3,pais:pai['p'+i],player:players[i],seat:i,turnseat:turnseat});
	    	// console.log(pai['p'+i]);
	    	//_socket.emit('gameinfo',userId, {code:1,roomid:roomid});
	    };
	    roomInfo[roomid].painum=53;
	};

	io.sockets.on('connection', function(socket){
		_socket=socket;
	    console.log("connected!");
	    var url = socket.request.headers;
	    var user = ''; 
	    var roomID='';

	    socket.on('join', function (userId,roomid) {
	   //  	if (typeof roomInfo[roomid]== "undefined") {
	   //  		var pais=initPai();
	   //  		roomInfo[roomid]={ 
				// 	hoster: userId,
				// 	users: [],
				//     time: 1496655299370,
				//     type: '1',
				//     rule: '123',
				//  	turn:0, 
				//  	player:0,
				//  	pais:pais
				// };
	   //  	} 
	      user = userId;
	      roomID=roomid; 
	      // console.log(roomInfo[roomid]);
	      // 将用户昵称加入房间名单中
	      if (!roomInfo[roomid]) {
	        socket.emit('roominfo', userId, {code:'0',msg: 'not found'});

	      }else{
	      	console.log(roomInfo[roomid].playernum);
	        if(roomInfo[roomid].users.length<roomInfo[roomid].playernum){
	        	var roomseat=roomInfo[roomid].users.length;
	           roomInfo[roomid].users.push(userId);
	          // console.log(roomInfo[roomid].users);
	          if (roomInfo[roomid].users.length==1 &&roomInfo[roomid].playernum==4) {
		        roomInfo[roomid].users.push(123);
		        roomInfo[roomid].users.push(456);
	          }
	          // console.log(roomInfo[roomid].users);

	          socket.join(roomid);  // 加入房间
	          socket.join(userId);


	          socket.to(roomid).emit('roominfo', userId, {code:'1',msg: userId+' join '+roomid+' ok'});
	          // 通知房间内人员
	          io.sockets.in(roomid).emit('sys', user + '加入了房间', roomInfo[roomid]);
	          console.log(user + '加入了' + roomid);
	          //console.log(roomInfo[roomid].users.length); 
	          if (roomInfo[roomid].users.length>=roomInfo[roomid].playernum) {
	            io.sockets.in(roomid).emit('roominfo',userId, roomid+" 有 "+ roomInfo[roomid].users+' 齐了');
 				io.sockets.in(roomid).emit('roominfo',userId, {code:2,roomid:roomid});
	           	//newGame(roomid,userId,players);
	          };

	        }else{
	        	console.log('full');
	          socket.emit('roominfo', userId, {code:'3',msg: 'people full'});
	        }; 
	      }         
	    });    
		
	    socket.on('leave', function () {
	      socket.emit('disconnect');
	    });

	    io.sockets.emit('connected', { value: "server ok" });

	    socket.on('message', function(data){
	      console.log("message: " +data);

	      if (roomInfo[roomID].users.indexOf(user) === -1) {  
	        return false;
	      }
	      io.sockets.in(roomID).emit('msg', user, data);
	    });

  		socket.on('roominfo', function(roomID,data){
  			if (data.code==2) {//创建房间
  				console.log('roominfo',roomID);
  				// console.log(data);  
  				var gametype=data.gametype;
  				var rule=data.rule;
  				var playernum=data.playernum;
  				var userid=data.userid;
  				var time=Date.now();
  				var pais=initPai();
  				var thepais=[];
  				for (var i = 0; i < pais.length; i++) {
  					thepais.push(pais[i]);
  				}
  				thepais[0]=0;
  				thepais[1]=0;
  				thepais[2]=0;
  				thepais[3]=1;
  				thepais[4]=2;
  				thepais[5]=3;
  				thepais[6]=4;
  				thepais[7]=5;
  				thepais[8]=6;
  				thepais[9]=7;
  				thepais[10]=8;
  				thepais[11]=8;
  				thepais[12]=8;
  				thepais[13]=7;
  				thepais[53]=0;
  				thepais[54]=0;
  				thepais[55]=1;
  				thepais[56]=1;
  				thepais[56]=1;
  				roomInfo[roomID]={ 
					hoster: userid,
					users: [],
				    time: time,
				    type: gametype,
				    rule: rule,
				    playernum:playernum,
				 	turn:0,
				 	player:0,
				 	pais:thepais,
				 	painum:0
				};
  			}
  		});

		socket.on('gameinfo', function(roomID,data){
	      console.log("gameinfo: "+roomID );
	      console.log(data);
	      //code 1新游戏开始
	      //console.log(data.player,roomInfo[roomID].hoster);
	      if (data.code==1 && data.player==roomInfo[roomID].hoster) {
	      	// var players=[roomInfo[roomID].hoster,roomInfo[roomID].users[0],roomInfo[roomID].users[1],roomInfo[roomID].users[2]];   
	      	newGame(roomID,roomInfo[roomID].users); 
	      }else if(data.code==4){//code 4 出牌 
	      	var turnplayer=roomInfo[roomID].player;
	      	var outpaitype=data.paitype;
	      	var theplayer=data.playerid;
	      	var seat=data.seat;
	      	var nextseat=(seat+5)%4;
	      	if (nextseat==1 ||nextseat==2) {
	      		nextseat=3;
	      	}
	      	roomInfo[roomID].player=(turnplayer+1)%4;
	      	io.sockets.to(roomID).emit('gameinfo',theplayer, {code:5,outpaitype:outpaitype,seat:seat,nextseat:nextseat,roomid:roomID,});
	      }else if(data.code==6){//抓牌
	      	var theplayer=data.playerid;
	      	var seat=data.seat;
	      	// console.log(roomInfo[roomID]);
	      	var allpais=roomInfo[roomID].pais;
	      	var nextpai=allpais[roomInfo[roomID].painum++];
	      	io.sockets.to(theplayer).emit('gameinfo',theplayer, {code:7,nextpai:nextpai,seat:seat});
	      }else if(data.code==8){//碰 
	      	var seat=data.seat;
	      	var paitype=data.paitype;
	      	var fromseat=data.fromseat;
	      	io.sockets.to(roomID).emit('gameinfo',seat, {code:9,paitype:paitype,seat:seat,fromseat:fromseat});
	      }else if(data.code==10){//gang 
	      	var seat=data.seat;
	      	var paitype=data.paitype;
	      	var fromseat=data.fromseat;
	      	io.sockets.to(roomID).emit('gameinfo',seat, {code:11,paitype:paitype,seat:seat,fromseat:fromseat});
	      };
	    });

	    socket.on('disconnect', function(){
	      	socket.leave(roomID);   // 退出房间  
	      	io.sockets.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
	     
	      	var index = roomInfo[roomID].users.indexOf(user);
		    if (index !== -1) {
		      roomInfo[roomID].users.splice(index, 1);
		    } 
		    console.log(user + '退出了' + roomID); 
	    });
	});

}  