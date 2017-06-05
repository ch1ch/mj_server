// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('./../conf/db');
// var $util = require('../util');
var $sql = require('./userSqlMapping');
var rooms={ '35503': { hoster: '12345' } };
var cardrule={'1':1,'2':2};
// 使用连接池，提升性能
//var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret,err) {
  if(typeof ret === 'undefined') {
    res.json({
      code:'0',
      msg: err
    });
  } else {
    res.json({
      code:'1',
      data: ret
    });
  }
};
 
module.exports = {
  getuser: function (req, res, next) {
     var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数

    pool.getConnection(function(err, connection) {
      connection.query($sql.getuser, id, function(errs, result) {
        console.log(result);
        console.log("--error--");
        console.log(errs);
        jsonWrite(res, result[0],errs);
        connection.release();
 
      });
    });
  },
  adduser: function (req, res, next) {
    pool.getConnection(function(err, connection) {
      // 获取前台页面传过来的参数
      var param = req.body;
      connection.query($sql.addnewuser, [param.openid, param.name, param.ico, param.card, param.tuijian,param.time], function(errs, result) {
        console.log(errs);

       // console.log('-----------');
      //  console.log(result);
        if(result) {
         // console.log(result);
          result = {
            code: 1,
            msg:'增加成功'
          };    
        // 以json形式，把操作结果返回给前台页面
        jsonWrite(res, result,errs);
        connection.release();          
        }else{
          result = {
            code: 0,
            msg:errs
          };    
        // 以json形式，把操作结果返回给前台页面
        jsonWrite(res, result,errs);
        connection.release();                
        }
      });
    });
  },

  addRoom:function(req, res, next){
    pool.getConnection(function(err, connection) {
      var notid=true;
      var roomid=0;
      var hoster=req.body.hoster;
      var gametype=req.body.gametype;
      var costcard=parseInt(cardrule[gametype]) ;
      connection.query($sql.getuser, hoster, function(errs, result) {
        console.log(result);
        console.log("--error--");
        console.log(errs);
        while(notid){
        //parseInt(Math.random()*max,10)+1;
         roomid=Math.floor(Math.random()*89999)+10000;
          if (typeof rooms[roomid]== "undefined") {
            notid=false;
           rooms[roomid]={'hoster':hoster}
         };
        }
        console.log(rooms);
        var hascard=parseInt(result[0].card);
        console.log(hascard);

        //消耗一张或两张
        if (hascard>=costcard) {
          console.log('can player');
        }else{
          console.log('not ength');
          res.json({
            'code':'0',
            'msg': 'card not ength'
          }); 
          return;
        };
        hascard-=costcard;
        var _sql=" UPDATE `user` SET `card`="+hascard+" WHERE (`openid`='"+hoster+"'); ";
        connection.query(_sql, function(_errs, _result) {
        // connection.query($sql.redu,1,hoster, function(_errs, _result) {
            console.log(_result);
            console.log("--error--");
            console.log(_errs);            
            if (result) {
              res.json({
                'code':'1',
                'date':{'roomid':roomid}
              });                          
            }else{
              res.json({
                'code':'0',
                'date':{'roomid':roomid}
              });                  
            };
           
          connection.release();  
        });
      });
    });    
  },


  creatroom: function (req, res, next) {
    pool.getConnection(function(err, connection) {
      // 获取前台页面传过来的参数
      var param = req.body;
      connection.query($sql.creatroom, [param.openid, param.name, param.ico, param.card, param.tuijian,param.time], function(errs, result) {
        console.log(errs);

       // console.log('-----------');
      //  console.log(result);
        if(result) {
         // console.log(result);
          result = {
            code: 1,
            msg:'增加成功'
          };    
        // 以json形式，把操作结果返回给前台页面
        jsonWrite(res, result,errs);
        connection.release();          
        }else{
          result = {
            code: 0,
            msg:errs
          };    
        // 以json形式，把操作结果返回给前台页面
        jsonWrite(res, result,errs);
        connection.release();                 
        }
 
       
      });
    });
  },  


  add: function (req, res, next) {
    pool.getConnection(function(err, connection) {
      // 获取前台页面传过来的参数
      var param = req.query || req.params ;
      // var param = req.body;
      // 建立连接，向表中插入值
      // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
      //console.log($sql.insert);
      //console.log(param);
      //console.log(param.name, param.age);
      connection.query($sql.insert, [param.name, param.age], function(err, result) {
       // console.log(err);
       // console.log('-----------');
       //  console.log(result);
        if(result) {
          console.log(result);
          result = {
            code: 200,
            msg:'增加成功'
          };    
        }
 
        // 以json形式，把操作结果返回给前台页面
        jsonWrite(res, result);
 
        // 释放连接 
        connection.release();
      });
    });
  },
  delete: function (req, res, next) {
    // delete by Id
    pool.getConnection(function(err, connection) {
      var id = +req.query.id;
      connection.query($sql.delete, id, function(err, result) {
        if(result.affectedRows > 0) {
          result = {
            code: 200,
            msg:'删除成功21'
          };
        } else {
          result = void 0;
        }
        jsonWrite(res, result);
        connection.release();
      });
    });
  },
  update: function (req, res, next) {
    // update by id
    // 为了简单，要求同时传name和age两个参数
    var param = req.body;
    if(param.name == null || param.age == null || param.id == null) {
      jsonWrite(res, undefined);
      return;
    }
 
    pool.getConnection(function(err, connection) {
      connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
        // 使用页面进行跳转提示
        if(result.affectedRows > 0) {
          res.render('suc', {
            result: result
          }); // 第二个参数可以直接在jade中使用
        } else {
          res.render('fail',  {
            result: result
          });
        }
 
        connection.release();
      });
    });
 
  },
queryAll: function (req, res, next) {
    console.log(req.query);
    pool.getConnection(function(err, connection) {
      connection.query($sql.queryAll, function(err, result) {
        jsonWrite(res, result);
        connection.release();
      });
    });
  }    
 
};