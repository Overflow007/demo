var settings = require('../settings');
var db_options={
    w:-1,// 设置w=-1是mongodb 1.2后的强制要求，见官方api文档
    logger:{
        doDebug:true,
        debug:function(msg,obj){
            console.log('[debug]',msg);
        },
        log:function(msg,obj){
            console.log('[log]',msg);
        },
        error:function(msg,obj){
            console.log('[error]',msg);
        }
    }
};
var Db = require('mongodb').Db;
var DEFAULT_PORT = 27017;
var Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, DEFAULT_PORT, db_options));
