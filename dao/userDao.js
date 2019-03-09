var mysql = require('mysql');
var $conf = require('./../conf/db');
 const Core = require('@alicloud/pop-core');
// var $util = require('../util');
var $sql = require('./userSqlMapping');
var rooms={ '355033': { hoster: '121176' } };
var cardrule={'1':1,'2':2};
// 使用连接池，提升性能 
//var pool  = mysql.createPool($util.extend({}, $conf.mysql));
var pool  = mysql.createPool($conf.mysql);
var allpai=[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33];

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret,err) {
  if(typeof ret === 'undefined') {
    res.json({
      code:'1',
      msg: err
    });
  } else {
    res.json({
      code:'0',
      data: ret
    });
  }
};

 function sendsms(name,mobi,msgid){
   

    var client = new Core({
      accessKeyId: 'LTAIgkafE9961wJc',
      accessKeySecret: 'ORpbiWeD1Qi00DbXNAc35uwziOj4m1',
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });

    var params = {
      "RegionId": "cn-hangzhou",
      "PhoneNumbers": "13522039592",
      "SignName": "传梦科技",
      "TemplateCode": "SMS_159420799",
      "TemplateParam": "{\"name\":\""+name+"\",\"number\":\""+mobi+"\"}"
    }

    var requestOption = {
      method: 'POST'
    };

    client.request('SendSms', params, requestOption).then((result) => {
      console.log(result);
    }, (ex) => {
      console.log(ex);
    })

  };

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



module.exports = {
  getuser: function (req, res, next) {
    var openid = req.query.openid; 
    var nickname = req.query.nickname; 
    var imgurl = req.query.imgurl; 
    var time=Date.now();

    pool.getConnection(function(err, connection) {
      connection.query($sql.getuser, openid, function(errs, result) {
        console.log(result);
        if (result=='') {
          console.log("need new");
          connection.query($sql.addnewuser, [openid, nickname, imgurl, 0, '',time], function(errs, result) {
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
        }else{
          console.log("--error--");
          console.log(errs);
          jsonWrite(res, result[0],errs);
          connection.release();
        }
       
 
      });
    });
  },



  getuserrank: function (req, res, next) {

    pool.getConnection(function(err, connection) {
      connection.query($sql.getuserrank, function(errs, result) {
        console.log(result);
        if (result=='') {
          result = {
            code: 2,
            msg:'查询失败'
          };    
        // 以json形式，把操作结果返回给前台页面
        jsonWrite(res, result,errs);
        connection.release();          
        }else{
          console.log(errs);
          jsonWrite(res, result,errs);
          connection.release();
        }
 
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
      var rule=req.body.rule;
      var costcard=parseInt(cardrule[gametype]) ;
      var time=Date.now();
      connection.query($sql.getuser, hoster, function(errs, result) {
        console.log(result);
        console.log(result);
        console.log("--error--");
        console.log(errs);
        while(notid){
        //parseInt(Math.random()*max,10)+1;
          roomid=Math.floor(Math.random()*89999)+10000;
          
          if (typeof rooms[roomid]== "undefined") {
            notid=false;
            // var pais=initPai();
            rooms[roomid]={'hoster':hoster,'time':time,'type':gametype,'rule':rule}
         
         };
        }
        if (result[0]&&result[0].card) {
          var hascard=parseInt(result[0].card);
        }else{
           res.json({
            'code':'0',
            'msg': 'not user'
          }); 
          return;
        }

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
        // roomid=355033;
        connection.query($sql.redu,[hascard,hoster], function(_errs, _result) {
            //console.log(_result);
            console.log("--error--");
            console.log(_errs);            
            if (result) {
              res.json({
                'code':'1',
                'data':{'roomid':roomid,'type':rooms[roomid].type}
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


  joinroom: function (req, res, next) {
    var roomid = +req.query.roomid;
    var openid = +req.query.openid;
    console.log("some join---------------");
    console.log(rooms[roomid]);
    if (typeof rooms[roomid]== "undefined") {
      res.json({
        code:'0',
        msg: 'not found'
      });
    }else{
      // if(typeof rooms[roomid].users!= "undefined" && rooms[roomid].users.length<=3){
      //   rooms[roomid].users.push(openid);
        res.json({
          code:'1',
          msg: 'found'
        });
      // }else{
      //   res.json({
      //     code:'0',
      //     msg: 'people full'
      //   });        
      // };    
    }
  },  

  addShare: function (req, res, next) {
    pool.getConnection(function(err, connection) {
      // 获取前台页面传过来的参数
      // var param = req.query || req.params ;
      var param = req.body;
      // 建立连接，向表中插入值
      // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
     // console.log($sql.addshare);
     //console.log(param);
      //console.log(param.name, param.age);
      connection.query($sql.addshare, [param.type,param.guestid, param.ua,param.time], function(err, result) {
      //  console.log(err);
       // console.log('-----------');
      //   console.log(result);
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

   login: function (req, res, next) {
   
      //var param = req.body;
	  var param = req.query || req.params ;
	  //console.log(req)
      var username=param.username;
      var password=param.password;
	  console.log(username)
	  console.log(password)
      if (username=="admin" && password=="pass") {
        
          result = {
            code: 0,
            key:"query123",
            msg:'登录成功'
          };    
        jsonWrite(res, result);
      }else{
         
          result = {
            code: 1,
            key:"",
            msg:'用户名'+param.username+'密码错误'+param.password,
			user:param.username
          };    
        jsonWrite(res, result);
      }
        ;
        
          
    
   
  },

  cashstatus: function (req, res, next) {
    var time=Date.now();
    var orderid=req.query.orderid;
    var openid=req.query.openid;
    var status=req.query.status;
    var money=req.query.money;
    var time=Date.now();
    console.log(orderid, status);
    pool.getConnection(function(err, connection) {
      connection.query($sql.getorder, orderid, function(errs, result) {
        if (errs) {
           console.log('--------------e');
           console.log(errs)
        }else{
           //console.log(result);
        };
       
        if (result=='') {
          console.log("IT IS new ORDER");
          if (status==2) {
            console.log($sql.addcard);
            connection.query($sql.addcard,[money,openid], function(_errs, _result) {
              if (_errs) {               
                console.log("--error----8");
                console.log(_errs); 
              }else{
                 // console.log(_result);
                 console.log("addcard成功");

              };
                        
              if (_result) {

              }
            });
          };
        
          connection.query($sql.addorder, [orderid,openid, status, money, time], function(__errs, __result) {
            if (__errs) {
              console.log(__errs);
              console.log('order --err---------');
              // console.log(result);
            };
            
            if(__result) {

              console.log(__result);
              console.log("order 增加成功");
              results = {
                code: 1,
                msg:'增加成功'
              };    
            // 以json形式，把操作结果返回给前台页面
            jsonWrite(res, results,errs);
            connection.release();          
            }else{
              results = {
                code: 0,
                msg:errs
              };    
              jsonWrite(res, results,errs);
              connection.release();                
            }
          });
        }else{
			console.log("it has ");
          if (errs) {
            console.log("--error-----1------");
            console.log(errs);
            results = {
                code: 0,
                msg:errs
              };    
              jsonWrite(res, results,errs);
              connection.release();
          };
          console.log(result[0]);
          // if (result[0].status) {};
          if (result[0].status!=2) {
            connection.query($sql.updateorder,[status,orderid], function(_errs, _result) {
              if (_errs) {
                console.log(_result);
                console.log("----error--2--");
                console.log(_errs);
                results = {
                  code: 0,
                  msg:_errs
                };    
                jsonWrite(res, results,_errs);
                connection.release();
                };
                          
              if (_result) {
                results = {
                  code: 2,
                  msg:_result
                };    
                jsonWrite(res, results,_errs);
                connection.release();
              }
            });
            if (status==2) {
              connection.query($sql.addcard,[money,openid], function(_errs, _result) {
                if (_errs) {
                  console.log(_result);
                  console.log("--error--3---");
                  console.log(_errs);
                };
                           
                if (_result) {
                  console.log("addcard成功");
                  results = {
                    code: 1,
                    msg:'增加成功'
                  };    
                  jsonWrite(res, results,_errs);
                  connection.release();

                }
              });
            };
          }else{
			  console.log("it is added");
            results = {
                    code: 3,
                    msg:'此订单已经使用'
                  };    
            jsonWrite(res, results);
            //connection.release();
          };
		
          //jsonWrite(res, result[0],errs);
          connection.release();
        }
       
 
      });
    });
  },

   addtumsg: function (req, res, next) {
    pool.getConnection(function(err, connection) {
      // 获取前台页面传过来的参数
      var param = req.body;
      connection.query($sql.addtumsg, [param.name, param.mail, param.mobi, param.sheng, param.city,param.class,param.msg], function(errs, result) {
        console.log(errs);

         console.log('-----------');
         console.log(result);
         console.log(result.insertId);
        if(result) {
         // console.log(result);
          result = {
            code: 1,
            msg:'增加成功'
          };    
        
        // 以json形式，把操作结果返回给前台页面
        sendsms(param.name, param.mobi,result.insertId);
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

  gettumsg: function (req, res, next) {
    var smsid = req.query.smsid; 
   
    var time=Date.now();

    pool.getConnection(function(err, connection) {
      connection.query($sql.gettumsg, smsid, function(errs, result) {
        console.log(result);
        if (result=='') {
            console.log(errs);
             // console.log('-----------');
            //  console.log(result);
              result = {
                code: 0,
                msg:errs
              };    
            // 以json形式，把操作结果返回给前台页面
            jsonWrite(res, result,errs);
        }else{
          console.log("--error--");
          console.log(errs);
          jsonWrite(res, result[0],errs);
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