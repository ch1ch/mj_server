// CRUD SQL语句
var user = {
	addnewuser:'insert into user(openid,name,ico,card,tuijian,time) values(?,?,?,?,?,?);',
	creatroom:'insert into room(roomid,hoster,user,type,rule,time) values(?,?,?,?,?,?);',
	queryById: 'select * from user where id=?;',
  	
  	insert:'insert into user(name, age) values(?,?);',

  	update:'update user set name=?, age=? where id=?;',
  	delete: 'delete from user where id=?;',
 
  	queryAll: 'select * from user;'
};
 
module.exports = user;