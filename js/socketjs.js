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
		roomInfo[roomid].p0pais=pais.slice(0,14);
		roomInfo[roomid].p1pais=pais.slice(14,27);
		roomInfo[roomid].p2pais=pais.slice(27,40);
		roomInfo[roomid].p3pais=pais.slice(40,53);
		var turnseat=roomInfo[roomid].turn%4;
	    for (var i = 0; i < players.length; i++) {
	    	 io.sockets.in(players[i]).emit('gameinfo',players[i], {code:3,pais:roomInfo[roomid]['p'+i+'pais'],player:players[i],seat:i,turnseat:turnseat,scorelist:roomInfo[roomid].scorelist});
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

	    socket.on('join', function (roomid,playerinfo) {
	      userId = playerinfo.playerid;
	      roomID=roomid; 
	      console.log(playerinfo);
	      if (typeof roomInfo[roomid] == "undefined" ||typeof roomInfo[roomid].playernum == "undefined") {
	      	return false;
	      }
	      console.log('想加入'+roomid,roomInfo[roomid].playernum,'人房 目前玩家有 '+roomInfo[roomid].users.length);
	      // 将用户昵称加入房间名单中
	      if (!roomInfo[roomid]) {
	        socket.emit('roominfo', userId, {code:'0',msg: 'not found'});

	      }else{
	      	// console.log(roomInfo[roomid].playernum);
	        if(roomInfo[roomid].users.length<roomInfo[roomid].playernum){

	        	socket.join(roomid);  // 加入房间
	          	socket.join(userId);

	        	var roomseat=roomInfo[roomid].playerlist.length;
	            roomInfo[roomid].users.push(userId);
	             var playernum=roomInfo[roomid].playerlist.length;
	            roomInfo[roomid].playerlist.push(playerinfo);
	            roomInfo[roomid].playerlist[playernum].seat=playernum;
	            // socket.in(roomid).emit('roominfo', userId, {code:'1',msg: userId+' join '+roomid+' ok',playerinfo:roomInfo[roomid].playerlist,roomseat:roomseat});

	            io.sockets.in(roomid).emit('roominfo', userId, {code:'1',msg: userId+' join '+roomid+' ok',playerinfo:roomInfo[roomid].playerlist,roomseat:roomseat});

	            console.log('player length ',roomInfo[roomid].users.length,roomInfo[roomid].playernum);
	           //测试数据 
	         	if (roomInfo[roomid].users.length==1 &&roomInfo[roomid].playernum==4) {

			        roomInfo[roomid].users.push(123);
			        playernum=roomInfo[roomid].playerlist.length;
			        roomInfo[roomid].playerlist.push({playerid:'234',imghead:"res/play/ui/header.png",playername:'张wu',seat:1})
			        io.sockets.in(roomid).emit('roominfo', userId, {code:'1',msg: '234 join '+roomid+' ok',playerinfo:roomInfo[roomid].playerlist,roomseat:1});

			        roomInfo[roomid].users.push(456);
			        playernum=roomInfo[roomid].playerlist.length;
			        roomInfo[roomid].playerlist.push({playerid:'456',imghead:"res/play/ui/header.png",playername:'张liu',seat:2})
			        io.sockets.in(roomid).emit('roominfo', userId, {code:'1',msg: '456 join '+roomid+' ok',playerinfo:roomInfo[roomid].playerlist,roomseat:2});

			        console.log(roomInfo[roomid].playerlist);
	          	}

	         
	          // 通知房间内人员
	          //io.sockets.in(roomid).emit('sys', userId + '加入了房间', roomInfo[roomid]);
	           
	          console.log(userId + '加入了' + roomid);
	          //console.log(roomInfo[roomid].users.length); 
	          if (roomInfo[roomid].users.length>=roomInfo[roomid].playernum) {
	            io.sockets.in(roomid).emit('roominfo',userId, roomid+" 有 "+ roomInfo[roomid].users+' 齐了');
 				io.sockets.in(roomid).emit('roominfo',userId, {code:2,roomid:roomid,playerinfo:roomInfo[roomid].playerlist});
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
  			console.log('roominfo',roomID,data);
  			if (data.code==2) {//创建房间
  				
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

  				thepais[40]=0;
  				thepais[41]=0;
  				thepais[42]=0;
  				thepais[43]=1;
  				thepais[44]=2;
  				thepais[45]=3;
  				thepais[46]=4;
  				thepais[47]=5;
  				thepais[48]=6;
  				thepais[49]=7;
  				thepais[50]=8;
  				thepais[51]=8;
  				thepais[52]=8;

  				thepais[53]=1;
  				thepais[54]=1;
  				thepais[55]=1;
  				thepais[56]=2;
  				thepais[56]=2;
  				roomInfo[roomID]={ 
					hoster: userid,
					users: [],
					playerlist:[],
				    time: time,
				    type: gametype,
				    rule: rule,
				    playernum:playernum,
				 	turn:0,
				 	player:0,
				 	pais:thepais,
				 	painum:0,
				 	outpai:0,
				 	gamenum:1,
				 	ganglist:[[],[],[],[]],
				 	scorelist:[100,100,100,100],
				 	p0pais:[],
				 	p1pais:[],
				 	p2pais:[],
				 	p3pais:[]
				};
  			} else if(data.code==4){
  				var turn=roomInfo[roomID].turn;
  				var seat=data.seat;
  				var pais=initPai();
  				roomInfo[roomID].pais=pais;
  				roomInfo[roomID].painum=0;
  				roomInfo[roomID].gamenum++;
  				if (seat!=turn) {
  					roomInfo[roomID].turn=(turn+5)%4;
  				};
  				console.log('renew game');
  				newGame(roomID,roomInfo[roomID].users);
  			}
  		});

		socket.on('gameinfo', function(roomID,data){
	      console.log("gameinfo: "+roomID );
	      console.log(data);
	      //code 1新游戏开始
	      //console.log(data.player,roomInfo[roomID].hoster);
	      if (data.code==1 && data.player==roomInfo[roomID].hoster) {
	      	newGame(roomID,roomInfo[roomID].users); 
	      }else if(data.code==4){//code 4 出牌 
	      	if (typeof roomInfo[roomID] == "undefined" ||typeof roomInfo[roomID].player == "undefined") {
		      	return false;
		     }
	      	var turnplayer=roomInfo[roomID].player;
	      	var outpaitype=data.paitype;
	      	var theplayer=data.playerid;
	      	var seat=data.seat;
	      	var nextseat=(seat+5)%4;
	      	roomInfo[roomID].outpai=data.paitype;
	      	//测试
	      	if (nextseat==1 ||nextseat==2) {
	      		nextseat=3;
	      	}
	      	roomInfo[roomID]['p'+seat+'pais']=data.pais;
	      	roomInfo[roomID].player=(turnplayer+1)%4;
	      	//console.log(roomInfo[roomID]);
	      	io.sockets.in(roomID).emit('gameinfo',theplayer, {code:5,outpaitype:outpaitype,seat:seat,nextseat:nextseat,roomid:roomID,});
	      }else if(data.code==6){//抓牌
	      	var theplayer=data.playerid;
	      	var seat=data.seat;
	      	// console.log(roomInfo[roomID]);
	      	var allpais=roomInfo[roomID].pais;
	      	var nextpai=allpais[roomInfo[roomID].painum++];
	      	io.sockets.in(theplayer).emit('gameinfo',theplayer, {code:7,nextpai:nextpai,seat:seat});
	      	var furturepai=136-roomInfo[roomID].painum;
	      	io.sockets.in(roomID).emit('gameinfo',seat, {code:15,seat:seat,furturepai:furturepai});

	      }else if(data.code==8){//碰 
	      	var seat=data.seat;
	      	var paitype=data.paitype;
	      	var fromseat=data.fromseat;
	      	io.sockets.in(roomID).emit('gameinfo',seat, {code:9,paitype:paitype,seat:seat,fromseat:fromseat});

	      }else if(data.code==10){//gang 
	      	var seat=data.seat;
	      	var paitype=data.paitype;
	      	var fromseat=data.fromseat;
	      	var theplayer=data.playerid;
	      	var allpais=roomInfo[roomID].pais;
	      	var nextpai=allpais[roomInfo[roomID].painum++];
	      	roomInfo[roomID].ganglist[seat].push({seat:seat,fromseat:fromseat,paitype:paitype});

	      	io.sockets.in(theplayer).emit('gameinfo',theplayer, {code:111,nextpai:nextpai,seat:seat,fromseat:fromseat});
	      	io.sockets.in(roomID).emit('gameinfo',seat, {code:11,paitype:paitype,seat:seat,fromseat:fromseat});

	      }else if(data.code==12){//hu  
	      	var seat=data.seat;
	      	var paitype=data.paitype;
	      	var nowpai=[roomInfo[roomID].p0pais,roomInfo[roomID].p1pais,roomInfo[roomID].p2pais,roomInfo[roomID].p3pais];
	      	//console.log('nowpai');
	      	//console.log(roomInfo[roomID].p0pais);
	      	io.sockets.in(roomID).emit('gameinfo',seat,{code:13,paitype:paitype,seat:seat,nowpai:nowpai,turn:roomInfo[roomID].turn,fromseat:data.outseat,outpai:roomInfo[roomID].outpai,gamenum:roomInfo[roomID].gamenum,ganglist:roomInfo[roomID].ganglist,hutype:data.hutype});

	      }else if(data.code==14){//清空房间
	      	roomInfo[roomID].users=[];
	      	
	      };
	    });

	    socket.on('disconnect', function(){
	      	socket.leave(roomID);   // 退出房间  
	      	io.sockets.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
	     	if (typeof roomInfo[roomID] == "undefined" ||typeof roomInfo[roomID].users == "undefined") {
	      	return false;
	      	}
	      	var index = roomInfo[roomID].users.indexOf(user);
		    if (index !== -1) {
		      roomInfo[roomID].users.splice(index, 1);
		    } 
		    console.log(user + '退出了' + roomID); 
	    });
	});

}  