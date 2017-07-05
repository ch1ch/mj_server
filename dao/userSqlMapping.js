var user = {
	addnewuser:'insert into user(openid,name,ico,card,tuijian,time) values(?,?,?,?,?,?);',
	creatroom:'insert into room(roomid,hoster,user,type,rule,time) values(?,?,?,?,?,?);',
	getuser: 'select * from user where openid=?;',

	reducecard:'UPDATE `user` SET `card`=`card`-? WHERE (`openid`=?);',
	redu:"UPDATE `user` SET `card`=? WHERE `openid` = ?;",
	//UPDATE `user` SET `card`=`card`-1 WHERE (`id`='109');
  	//reducecard:'update `user` set `card` = IF(`card`<?, 0, `card`-?) WHERE `openid` = ?',

  	addshare:'insert into share(type,guestid,ua,time) values(?,?,?,?);',

  	insert:'insert into user(name, age) values(?,?);',

  	update:'update user set name=?, age=? where id=?;',
  	delete: 'delete from user where id=?;',
 
  	queryAll: 'select * from user;'
};
 
module.exports = user;